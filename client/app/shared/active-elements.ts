import { Input, Directive, OnInit, OnDestroy, ElementRef, Inject, forwardRef, HostListener, OnChanges, ChangeDetectorRef, AfterViewChecked, AfterViewInit, Renderer, EventEmitter, Output } from '@angular/core';
import { Arrays } from './arrays';

const ACTIVE_ELEMENT_SELECTOR = '[cc-active]'

@Directive({
  selector: ACTIVE_ELEMENT_SELECTOR,
  exportAs: 'cc-active'
})
export class ActiveElementDirective implements OnInit, OnDestroy, AfterViewInit {
  private active: boolean
  private bubble: boolean

  parent: ActiveElementDirective
  children: ActiveElementDirective[] = []

  @Input()
  id: string

  @Input('no-bubble')
  noBubbleAttr: any

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
    this.bubble = (this.noBubbleAttr === undefined);
    this.service.registerChild(this, this.bubble);
    this.service.registerParent(this);
  }

  ngOnDestroy() {
    this.active = false;
    this.service.deregisterChild(this)
    this.service.deregisterParent(this)
  }

  ngAfterViewInit() {
  }

  handleChildActive(child: ActiveElementDirective) {
    this.makeActive()

    for(let c of this.children) {
      if(c != child) {
        c.makeInactive();
      }
    }
  }

  handleChildInactive(child: ActiveElementDirective) {
    if(this.children.every(c => !c.active)) {
      this.makeInactive();
    }
  }

  makeActive() {
    if(!this.active) {
      this.active = true;
      this.activate.emit(null);

      if(this.parent) {
        this.parent.handleChildActive(this);
      }
    }
  }

  makeInactive() {
    if(this.active) {
      this.active = false;
      this.deactivate.emit(null);
      
      for(let c of this.children) {
        c.makeInactive();
      }
      
      if(this.parent) {
        this.parent.handleChildInactive(this);
      }
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

  constructor(el: ElementRef,
    @Inject(forwardRef(() => ActiveService))
    private service: ActiveService) {
      this.el = el;
  }

  @HostListener('focus')
  onFocus() {
    this.service.makeActive(this.el.nativeElement);
  }
}



@Directive({
  selector: '[cc-deactivate-on-blur]'
})
export class DeactivateOnBlurDirective {
  el: ElementRef;

  constructor(el: ElementRef,
    @Inject(forwardRef(() => ActiveService))
    private service: ActiveService) {
      this.el = el;
  }

  @HostListener('blur')
  onBlur() {
    setTimeout(() => this.service.makeInactive(this.el.nativeElement), 100);
  }
}

export class ActiveService {
  parents: ActiveElementDirective[] = []
  children: ActiveElementDirective[] = []

  registerParent(parent: ActiveElementDirective) {
    this.parents.push(parent);
  }

  registerChild(child: ActiveElementDirective, bubble: boolean) {
    this.children.push(child);

    if(bubble) {
      let foundParent = false;
      for(let p of this.parents) {
        let children: any[] = [].slice.call(p.element.querySelectorAll(ACTIVE_ELEMENT_SELECTOR));
        let childrenOfOtherParents: any[] = [].slice.call(p.element.querySelectorAll(':scope ' + ACTIVE_ELEMENT_SELECTOR + ' ' + ACTIVE_ELEMENT_SELECTOR));
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
    }
  }

  deregisterParent(parent: ActiveElementDirective) {
    for(let c of parent.children) {
      c.parent = null;
    }
    parent.children = [];
    Arrays.remove(this.parents, parent);
  }

  deregisterChild(child: ActiveElementDirective) {
    Arrays.remove(this.children, child);
    if(child.parent) {
      Arrays.remove(child.parent.children, child);
    }
    child.parent = null;
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
      child.makeInactive();
    }
  }
}