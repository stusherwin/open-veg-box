import {Component, Input, Directive, ElementRef, OnInit, Renderer, Host, Inject, forwardRef, Output, EventEmitter, OnDestroy} from '@angular/core';
import {FocusService} from './focus.service';

const BLUR_GRACE_PERIOD_MS: number = 100;

@Directive({
  selector: '[cc-focus]',
  exportAs: 'cc-focus'
})
export class FocusDirective implements OnInit, OnDestroy {
  focused: boolean;
  shouldBlur: boolean;
  directlyFocused: boolean;
  closestFocusedDescendent: FocusDirective;

  constructor(
    private el: ElementRef, 
    private renderer: Renderer, 
    @Inject(forwardRef(() => FocusService))
    private service: FocusService) {
  }

  @Input()
  grab: boolean;

  @Input()
  focusedClass: string;

  @Input()
  selectAll: boolean;

  @Input()
  noBlur: boolean;

  @Output()
  focus: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  blur: EventEmitter<any> = new EventEmitter<any>();

  ngOnInit() {
    this.service.register(this, !this.isFocusable(elem));

    var elem = this.el.nativeElement;

    if(this.isFocusable(elem)) {
      elem.onfocus = () => {
        this.setFocused(true);
      };
        
      elem.onblur = () => {
        this.setFocused(false);
      };
    }
    
    if (this.grab) {
      this.renderer.invokeElementMethod(elem, 'focus', []);
    }
  }

  ngOnDestroy() {
    this.service.deregister(this);
  }

  beFocused() {
    this.directlyFocused = true;
    let elem = this.el.nativeElement;
    if(this.isFocusable(elem)) {
      setTimeout(() => this.renderer.invokeElementMethod(this.el.nativeElement, 'focus', []));
    } else {
      this.setFocused(true);
    }
  }

  beBlurred() {
    let elem = this.el.nativeElement;
    if(this.isFocusable(elem)) {
      setTimeout(() => this.renderer.invokeElementMethod(this.el.nativeElement, 'blur', []));
    } else {
      this.setFocused(false);
    }
    this.service.blurDescendents(this);
  }

  isFocusable(element: any) {
    return element instanceof HTMLInputElement
        || element instanceof HTMLButtonElement
        || element instanceof HTMLAnchorElement
        || element instanceof HTMLSelectElement
        || element instanceof HTMLTextAreaElement;
  }

  setFocused(focused: boolean) {
    let focusChanged = this.focused != focused;
    if(focusChanged) {
      let elem = this.el.nativeElement;
      this.focused = focused;
      if(this.focused) {
        this.focus.emit(null);
        this.shouldBlur = false;
        if(this.focusedClass) {
          this.renderer.setElementClass(elem, this.focusedClass, true);
        }
        if(this.selectAll) {
          this.renderer.invokeElementMethod(elem, 'setSelectionRange', [0, elem.value.length]);
        }
        this.service.onFocus(this);
      } else {
        this.blur.emit(null);
        this.directlyFocused = false;
        if(this.focusedClass) {
          this.renderer.setElementClass(elem, this.focusedClass, false);
        }
        
        if(!this.noBlur) {
          this.service.onBlur(this);
        }
      }
    }
  }

  descendentFocus(descendent: FocusDirective): boolean {
    if(!this.closestFocusedDescendent) {
      this.closestFocusedDescendent = descendent;
    } else {
      if(descendent.getAncestorDepth(this.closestFocusedDescendent) >= 0) {
        // descendent is ancestor of closestFocusedDescendent
        this.closestFocusedDescendent = descendent
      } else if(this.closestFocusedDescendent.getAncestorDepth(descendent) >= 0) {
        // closestFocusedDescendent is ancestor of descendent (ignore)
      } else {
        // descendent is not an ancestor of closestFocusedDescendent and is being focused
        // so closestFocusedDescendent needs to be blurred.
        // (we need this for directives that don't automatically blur themselves)
        this.closestFocusedDescendent.beBlurred();
        this.closestFocusedDescendent = descendent
      }
    }

    this.shouldBlur = false;
    this.setFocused(true);

    return true;  
  }

  descendentBlur(descendent: FocusDirective): boolean {
    if(this.closestFocusedDescendent == descendent) {
      this.closestFocusedDescendent = null;
    }
    
    if(!this.shouldBlur && !this.directlyFocused) {
      this.shouldBlur = true;
    }

    setTimeout(() => {
      if(this.shouldBlur) {
        this.setFocused(false);
        this.shouldBlur = false;
      }
    }, BLUR_GRACE_PERIOD_MS);

    return true;
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

  isOutside(x: number, y: number) {
    let clientRect = this.el.nativeElement.getBoundingClientRect();
    return x < clientRect.left || x > clientRect.right
        || y < clientRect.top || y > clientRect.bottom;
  }
}