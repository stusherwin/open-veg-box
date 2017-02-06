import {Component, Input, Directive, ElementRef, OnInit, Renderer, Host, Inject, forwardRef, Output, EventEmitter, OnDestroy} from '@angular/core';
import {FocusService} from './focus.service';
import {Arrays} from './arrays';

const BLUR_GRACE_PERIOD_MS: number = 100;

@Directive({
  selector: '[cc-focus]',
  exportAs: 'cc-focus'
})
export class FocusDirective implements OnInit, OnDestroy {
  focused: boolean;
  parent: FocusDirective;
  children: FocusDirective[] = [];

  constructor(
    private el: ElementRef, 
    private renderer: Renderer, 
    @Inject(forwardRef(() => FocusService))
    private service: FocusService) {
  }

  @Input()
  focusedClass: string;

  @Input()
  selectAll: boolean;

  @Input()
  handleClickOutside: boolean;

  @Input()
  noBlur: boolean;

  @Output()
  focus: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  blur: EventEmitter<any> = new EventEmitter<any>();

  ngOnInit() {
    this.service.register(this, this.handleClickOutside);

    var elem = this.el.nativeElement;
    if(this.isFocusable()) {
      elem.onfocus = () => {
        setTimeout(() => this.setFocused(true));
      };

      // elem.onblur = () => {
      //   setTimeout(() => this.setFocused(false, "onblur"));
      // };
    }
  }

  ngOnDestroy() {
    this.service.deregister(this);
  }

  addChild(child: FocusDirective) {
    this.children.push(child);
    child.parent = this;
  }

  removeChild(child: FocusDirective) {
    child.parent = null;
    Arrays.remove(this.children, child);
  }

  beFocused() {
    this.setFocused(true);

    let elem = this.el.nativeElement;
    if(this.isFocusable()) {
      setTimeout(() => this.renderer.invokeElementMethod(this.el.nativeElement, 'focus', []));
    }
  }

  beBlurred() {
    this.setFocused(false);

    let elem = this.el.nativeElement;
    if(this.isFocusable()) {
      setTimeout(() => this.renderer.invokeElementMethod(this.el.nativeElement, 'blur', []));
    }
  }

  getAncestorDepth(element: FocusDirective): number {
    let depth = 0
    let ancestor = element.el.nativeElement;
    while(ancestor != null) {
      if(ancestor == this.el.nativeElement) {
        return depth;
      }
      ancestor = ancestor.parentNode;
      depth++;
    }
    return -1;
  }

  outsideClick(x: number, y: number) {
    if(this.focused && this.isOutside(x, y)) {
      this.beBlurred();
    }
  }

  private blurIfAllChildrenBlurred() {
    if(this.children.every(c => !c.focused)) {
      this.beBlurred();
      if(this.parent) {
        this.parent.blurIfAllChildrenBlurred();
      }
    }
  }

  private isOutside(x: number, y: number) {
    let clientRect = this.el.nativeElement.getBoundingClientRect();
    return x < clientRect.left || x > clientRect.right
        || y < clientRect.top || y > clientRect.bottom;
  }

  private setFocused(focused: boolean) {
    if(this.focused == focused) {
      return;
    }

    this.focused = focused;
    let elem = this.el.nativeElement;

    if(this.focused) {
      this.focus.emit(null);

      if(this.focusedClass) {
        setTimeout(() => this.renderer.setElementClass(elem, this.focusedClass, true));
      }
      
      if(this.isText()) {
        if(this.selectAll) {
          setTimeout(() => this.renderer.invokeElementMethod(elem, 'setSelectionRange', [0, elem.value.length]));
        } else {
          setTimeout(() => this.renderer.invokeElementMethod(elem, 'setSelectionRange', [elem.value.length, elem.value.length]));
        }
      }

      let parent = this.parent;
      if(parent) {
        parent.beFocused();

        let siblings = parent.children.filter(c => c != this);

        for(let s of siblings) {
          s.beBlurred();
        }
      }
    } else {
      this.blur.emit(null);

      if(this.focusedClass) {
        this.renderer.setElementClass(elem, this.focusedClass, false);
      }

      for(let child of this.children) {
        child.beBlurred();
      }

      if(this.parent) {
        this.parent.blurIfAllChildrenBlurred();
      }
    }
  }

  private isFocusable() {
    let elem = this.el.nativeElement;
    
    return elem instanceof HTMLInputElement
        || elem instanceof HTMLButtonElement
        || elem instanceof HTMLAnchorElement
        || elem instanceof HTMLSelectElement
        || elem instanceof HTMLTextAreaElement;
  }

  private isText() {
    let elem = this.el.nativeElement;
    
    return (elem instanceof HTMLInputElement && ((<HTMLInputElement>elem).type == "text" || (<HTMLInputElement>elem).type == "password"))
        || elem instanceof HTMLTextAreaElement;
  }

  stringify() {
    let elem = this.el.nativeElement;
    let result = '<' + elem.tagName.toLowerCase();
    if(elem.tagName == "INPUT") {
      result += ' type="' + elem.type + '"';
    }
    result += ' class="' + elem.className + '">';
    
    if(elem.tagName == "A") {
      result += elem.innerHTML.replace(/\s+/g, ' ') + '</a>';
    }
    return result;
  }
}