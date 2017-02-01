import { Component, Input, Directive, OnInit, OnDestroy, ElementRef, Inject, forwardRef, HostListener, OnChanges, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { FocusDirective } from '../shared/focus.directive';
import { Arrays } from '../shared/arrays';

@Directive({
  selector: '[cc-active-parent]'
})
export class ActiveParentDirective implements OnInit, OnDestroy, OnChanges {
  el: ElementRef;
  children: ActiveDirective[] = []

  constructor(el: ElementRef,
    @Inject(forwardRef(() => ActiveService))
    private service: ActiveService,
    private changeDetector: ChangeDetectorRef) {
      this.el = el;
  }

  @Input()
  id: string

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
    if(this.service.isActive(this)) {
      
    }
  }
}


@Directive({
  selector: '[cc-active]'
})
export class ActiveDirective implements OnInit, OnDestroy {
  el: ElementRef;
  active: boolean = false;

  constructor(el: ElementRef,
    @Inject(forwardRef(() => ActiveService))
    private service: ActiveService) {
      this.el = el;
  }

  @Input()
  id: string

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
  parents: ActiveParentDirective[] = []
  children: ActiveDirective[] = []

  registerParent(parent: ActiveParentDirective) {
    console.log('Register parent \'' + parent.id + '\'');

    this.parents.push(parent);
  }

  registerChild(child: ActiveDirective) {
    console.log('Register child \'' + child.id + '\'');

    this.children.push(child);
    
    for(let p of this.parents) {
      let children: any[] = [].slice.call(p.el.nativeElement.querySelectorAll('[cc-active]'));
      let childrenOfOtherParents: any[] = [].slice.call(p.el.nativeElement.querySelectorAll(':scope [cc-active-parent] [cc-active]'));
      let exclusiveChildren = children.filter(c => !childrenOfOtherParents.find(oc => oc == c));

      for(let c of exclusiveChildren) {
        if(child.el.nativeElement == c) {
          p.children.push(child);
        }
      }
    }

    for(let p of this.parents) {
      console.log('Parent \'' + p.id + '\' children: ');
      console.log(p.children.map(c => c.id));
    }
  }

  deregisterParent(parent: ActiveParentDirective) {
    Arrays.remove(this.parents, parent);
  }

  deregisterChild(child: ActiveDirective) {
    Arrays.remove(this.children, child);
    
    for(let p of this.parents) {
      if(p.children.find(c => c == child)) {
        Arrays.remove(p.children, child);
        break;
      }
    }
  }

  activate(element: ActiveOnClickDirective) {
    let child = this.children.find(c => c.el.nativeElement == element.el.nativeElement);
    if(child) {
      child.activate();
    } else {
      console.log('no child found for: ');
      console.log(element.el);
    }
  }
}

@Component({
  selector: 'cc-collection-points',
  templateUrl: 'app/collection-points/collection-points.component.html',
  directives: [ActiveParentDirective, ActiveDirective, ActiveOnClickDirective],
  providers: [ActiveService]
})

export class CollectionPointsComponent { }