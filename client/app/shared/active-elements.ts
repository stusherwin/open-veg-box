import { Input, Directive, OnInit, OnDestroy, ElementRef, Inject, forwardRef, HostListener, OnChanges, ChangeDetectorRef, AfterViewChecked, Renderer, EventEmitter, Output } from '@angular/core';
import { Arrays } from './arrays';

const ACTIVE_ELEMENT_SELECTOR = '[cc-active]'
const ACTIVE_PARENT_ELEMENT_SELECTOR = '[cc-active-parent]'

export interface ActiveElement {
  id: string
  element: Element
  active: boolean
  parent: ActiveParentElement
  makeActive(): void
  makeInactive(): void
}

export interface ActiveParentElement {
  id: string
  element: Element
  children: ActiveElement[]
  isActiveElement: boolean;
  activeElement: ActiveElement
  handleChildStateChange(): void
}

// Grace period for how long to wait before deactivating parent 
// (see ActiveParentDirective.handleChildStateChange())
// This should be the smallest possible value that still works
// - need to tinker as will be different per client
  
const INACTIVE_GRACE_PERIOD_MS = 100

@Directive({
  selector: ACTIVE_PARENT_ELEMENT_SELECTOR
})
export class ActiveParentDirective implements OnInit, OnDestroy, ActiveParentElement {
  private active: boolean
  isActiveElement: boolean
  activeElement: ActiveElement
  children: ActiveElement[] = []

  @Input()
  id: string

  @Input('cc-active')
  ccActive: any

  get element(): Element {
    return this.el.nativeElement;
  }

  @Output()
  activate = new EventEmitter<void>()

  @Output()
  deactivate = new EventEmitter<void>()

  constructor(
    private el: ElementRef,

    @Inject(forwardRef(() => ActiveService))
    private service: ActiveService) {
  }

  ngOnInit() {
    this.isActiveElement = (this.ccActive !== undefined);
    this.service.registerParent(this);
  }

  ngOnDestroy() {
    this.service.deregisterParent(this)
  }

  deactivating = false;
  handleChildStateChange() {
    if(this.children.find(c => c.active)) {
      this.deactivating = false;

      if(!this.active) {
        this.active = true;
        this.activate.emit(null);

        if(this.activeElement) {
          this.activeElement.makeActive()
        }
      }
    } else {
      if(this.active) {
        this.deactivating = true;

        // Defer deactivating because if another child is going to be activated immediately
        // we don't want to deactivate then immediately reactivate the parent.
        setTimeout(() => {
          if(this.deactivating) {
            this.deactivating = false;
            this.active = false;
            this.deactivate.emit(null);
            
            if(this.activeElement) {
              this.activeElement.makeInactive()
            }
          }
        }, INACTIVE_GRACE_PERIOD_MS)  
      }
    }

    if(!this.active && this.children.find(c => c.active)) {
      this.deactivating = false;
      this.active = true;
      this.activate.emit(null);

      if(this.activeElement) {
        this.activeElement.makeActive()
      }
    } else if(this.active && this.children.every(c => !c.active)) {
      this.deactivating = true;
      // Defer deactivating because if another child is going to be activated immediately
      // we don't want to deactivate then immediately reactivate the parent.
      setTimeout(() => {
        if(this.deactivating) {
          this.deactivating = false;
          this.active = false;
          this.deactivate.emit(null);
          
          if(this.activeElement) {
            this.activeElement.makeInactive()
          }
        }
      }, INACTIVE_GRACE_PERIOD_MS)
    }
  }
}


@Directive({
  selector:  ACTIVE_ELEMENT_SELECTOR
})
export class ActiveDirective implements OnInit, OnDestroy, ActiveElement {
  parent: ActiveParentElement
  active: boolean

  @Output()
  activate = new EventEmitter<void>()

  @Output()
  deactivate = new EventEmitter<void>()

  @Input()
  id: string

  get element(): Element {
    return this.el.nativeElement;
  }

  constructor(
    private el: ElementRef,

    @Inject(forwardRef(() => ActiveService))
    private service: ActiveService) {
  }

  ngOnInit() {
    this.service.registerChild(this)
  }

  ngOnDestroy() {
    this.active = false;
    if(this.parent){
     this.parent.handleChildStateChange();
    }
    this.service.deregisterChild(this)
  }

  makeActive() {
    if(!this.active) {
      this.active = true;
      if(this.parent) {
        this.parent.handleChildStateChange();
      }
      this.activate.emit(null);
    }
  }

  makeInactive() {
    if(this.active) {
      this.active = false;
      if(this.parent) {
        this.parent.handleChildStateChange();
      }
      this.deactivate.emit(null);
    }
  }
}


@Directive({
  selector: '[cc-toggle-active-on-click]'
})
export class ToggleActiveOnClickDirective {
  el: ElementRef;
  private active = false;

  @HostListener('click')
  onClick() {
    if(this.active) {
      this.service.makeInactive(this.el.nativeElement);
    } else {
      this.service.makeActive(this.el.nativeElement);
    }
    this.active = !this.active;
  }

  constructor(el: ElementRef,
    @Inject(forwardRef(() => ActiveService))
    private service: ActiveService) {
      this.el = el;
  }
}


@Directive({
  selector: '[cc-activate-on-focus]'
})
export class ActivateOnFocusDirective {
  el: ElementRef;
  private active = false;

  constructor(el: ElementRef,
    @Inject(forwardRef(() => ActiveService))
    private service: ActiveService) {
      this.el = el;
  }

  @HostListener('focus')
  onFocus() {
    if(!this.active) {
      this.active = true;
      this.service.makeActive(this.el.nativeElement);
    }
  }

  @HostListener('blur')
  onBlur() {
    if(this.active) {
      this.active = false;
      this.service.makeInactive(this.el.nativeElement)
    }
  }
}


export class ActiveService {
  parents: ActiveParentElement[] = []
  children: ActiveElement[] = []

  registerParent(parent: ActiveParentElement) {
    this.parents.push(parent);

    if(parent.isActiveElement) {
      let childToLink = this.children.find(c => c.element == parent.element);
      if(childToLink) {
        parent.activeElement = childToLink;
      }
    }
  }

  registerChild(child: ActiveElement) {
    this.children.push(child);

    let foundParent = false;
    for(let p of this.parents) {
      let children: any[] = [].slice.call(p.element.querySelectorAll(ACTIVE_ELEMENT_SELECTOR));
      let childrenOfOtherParents: any[] = [].slice.call(p.element.querySelectorAll(':scope ' + ACTIVE_PARENT_ELEMENT_SELECTOR + ' ' + ACTIVE_ELEMENT_SELECTOR));
      let exclusiveChildren = children.filter(c => !childrenOfOtherParents.find(oc => oc == c));

      for(let c of exclusiveChildren) {
        if(child.element == c) {
          p.children.push(child);
          child.parent = p;
          foundParent = true;
          break;
        }
      }

      if(foundParent) {
        break;
      }
    }

    let parentToLink = this.parents.find(p => p.isActiveElement && p.element == child.element);
    if(parentToLink) {
      parentToLink.activeElement = child;
    }
  }

  deregisterParent(parent: ActiveParentElement) {
    for(let c of parent.children) {
      c.parent = null;
    }
    parent.children = [];
    parent.activeElement = null;
    Arrays.remove(this.parents, parent);
  }

  deregisterChild(child: ActiveElement) {
    Arrays.remove(this.children, child);
    Arrays.remove(child.parent.children, child);
    child.parent = null;
    let linkedParent = this.parents.find(p => p.activeElement == child);
    if(linkedParent) {
      linkedParent.activeElement = null;
    } 
  }

  makeActive(element: Element) {
    let child = this.children.find(c => c.element == element);
    if(child) {
      child.makeActive();
    }
  }

  makeInactive(element: Element) {
    let child = this.children.find(c => c.element == element);
    if(child) {
      //setTimeout(() => child.makeInactive(), INACTIVE_GRACE_PERIOD_MS);
      child.makeInactive();
    }
  }
}