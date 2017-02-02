import { Component, Input, Directive, OnInit, OnDestroy, ElementRef, Inject, forwardRef, HostListener, OnChanges, ChangeDetectorRef, AfterViewChecked, Renderer } from '@angular/core';
import { FocusDirective } from '../shared/focus.directive';
import { Arrays } from '../shared/arrays';


export interface ActiveElement {
  id: string;
  element: Element;
  active(): boolean;
}

export interface ActiveParentElement extends ActiveElement {
  children: ActiveElement[]
}


@Directive({
  selector: '[cc-active-parent]'
})
export class ActiveParentDirective implements OnInit, OnDestroy, OnChanges, ActiveParentElement {
  private isActive: boolean;
  children: ActiveElement[] = []

  constructor(
    private el: ElementRef,

    @Inject(forwardRef(() => ActiveService))
    private service: ActiveService,

    private changeDetector: ChangeDetectorRef,
    private renderer: Renderer) {
  }

  @Input()
  id: string

  @Input('active-class')
  activeClass: string

  get element(): Element {
    return this.el.nativeElement;
  }

  active(): boolean {
    return !!this.children.find(c => this.service.isActive(c));
  }

  ngOnInit() {
    this.service.registerParent(this)
  }  

  ngOnDestroy() {
    this.service.deregisterParent(this)
  }

  ngOnChanges() {
    console.log('Parent \'' + this.id + '\' OnChanges')
  }

  ngAfterViewChecked() {
    console.log('Parent \'' + this.id + '\' AfterViewChecked')
    let newActive = this.active();
    if(this.isActive != newActive) {
      this.isActive = newActive;
      console.log('active changed:');
      console.log(this.isActive);
      this.renderer.setElementClass(this.el.nativeElement, this.activeClass, this.isActive);
      //this.changeDetector.detectChanges();
    }
    //if(this.service.isActive(this)) {
      
    //}
  }
}


@Directive({
  selector: '[cc-active]:not([cc-active-parent])'
})
export class ActiveDirective implements OnInit, OnDestroy, ActiveElement {
  constructor(
    private el: ElementRef,
    
    @Inject(forwardRef(() => ActiveService))
    private service: ActiveService) {
  }

  @Input()
  id: string

  get element(): Element {
    return this.el.nativeElement;
  }

  active(): boolean {
    return this.service.isActive(this);
  }

  ngOnInit() {
    this.service.registerChild(this)    
  }  

  ngOnDestroy() {
    this.service.deregisterChild(this)        
  }
}


@Directive({
  selector: '[cc-active-on-click]' //,
  // host: {
  //   '(click)': 'onClick()'
  // }
})
export class ActiveOnClickDirective implements OnInit, OnDestroy {
  el: ElementRef;

  @HostListener('click')
  onClick() {
    console.log('click!');
    this.service.activate(this);
  }

  constructor(el: ElementRef,
    @Inject(forwardRef(() => ActiveService))
    private service: ActiveService) {
      this.el = el;
  }

  ngOnInit() {
    console.log('active-on-click OnInit')
  }  

  ngOnDestroy() {
  }  
}


export class ActiveService {
  parents: ActiveParentElement[] = []
  children: ActiveElement[] = []
  activeElement: ActiveElement = null;

  registerParent(parent: ActiveParentElement) {
    console.log('Register parent \'' + parent.id + '\'');

    this.parents.push(parent);
  }

  registerChild(child: ActiveElement) {
    console.log('Register child \'' + child.id + '\'');

    this.children.push(child);
    
    for(let p of this.parents) {
      let children: any[] = [].slice.call(p.element.querySelectorAll('[cc-active]'));
      let childrenOfOtherParents: any[] = [].slice.call(p.element.querySelectorAll(':scope [cc-active-parent] [cc-active]'));
      let exclusiveChildren = children.filter(c => !childrenOfOtherParents.find(oc => oc == c));

      for(let c of exclusiveChildren) {
        if(child.element == c) {
          p.children.push(child);
        }
      }
    }

    //for(let p of this.parents) {
      //console.log('Parent \'' + p.id + '\' children: ');
      //console.log(p.children.map(c => c.id));
    //}
  }

  deregisterParent(parent: ActiveParentElement) {
    Arrays.remove(this.parents, parent);
  }

  deregisterChild(child: ActiveElement) {
    Arrays.remove(this.children, child);
    
    for(let p of this.parents) {
      if(p.children.find(c => c == child)) {
        Arrays.remove(p.children, child);
        break;
      }
    }
  }

  activate(element: ActiveOnClickDirective) {
    let child = this.children.find(c => c.element == element.el.nativeElement);
    if(child) {
      this.activeElement = child;
    } else {
      console.log('no child found for: ');
      console.log(element.el);
    }
  }

  isActive(element: ActiveElement): boolean {
    return this.activeElement == element;
  }
}

@Component({
  selector: 'cc-collection-points',
  templateUrl: 'app/collection-points/collection-points.component.html',
  directives: [ActiveParentDirective, ActiveDirective, ActiveOnClickDirective],
  providers: [ActiveService]
})

export class CollectionPointsComponent { }