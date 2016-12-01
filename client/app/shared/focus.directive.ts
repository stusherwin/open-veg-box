import {Component, Input, Directive, ElementRef, OnInit, Renderer, Host, Inject, forwardRef, Output, EventEmitter} from '@angular/core';
import {FocusService} from './focus.service';

const BLUR_GRACE_PERIOD_MS: number = 10;

@Directive({
  selector: '[cc-focus]',
  exportAs: 'cc-focus'
})
export class FocusDirective implements OnInit {
  focused: boolean;
  shouldBlur: boolean;
  closedFocusedDescendent: FocusDirective;

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
    this.service.register(this);

    var elem = this.el.nativeElement;

    elem.onfocus = () => {
      this.setFocused(true);
    };
      
    elem.onblur = () => {
      this.setFocused(false);
    };

    if (this.grab) {
      this.renderer.invokeElementMethod(elem, 'focus', []);
    }
  }

  beFocused() {
    let elem = this.el.nativeElement;
    if(elem instanceof HTMLInputElement) {
      setTimeout(() => this.renderer.invokeElementMethod(this.el.nativeElement, 'focus', []));
    } else {
      this.setFocused(true);
    }
  }

  beBlurred() {
    let elem = this.el.nativeElement;
    if(elem instanceof HTMLInputElement) {
      setTimeout(() => this.renderer.invokeElementMethod(this.el.nativeElement, 'blur', []));
    } else {
      this.setFocused(false);
    }
    this.service.blurDescendents(this);
  }

  setFocused(focused: boolean) {
    let focusChanged = this.focused != focused;
    if(focusChanged) {
      let elem = this.el.nativeElement;
      this.focused = focused;
      if(this.focused) {
        if(this.focusedClass) {
          this.renderer.setElementClass(elem, this.focusedClass, true);
        }
        if(this.selectAll) {
          this.renderer.invokeElementMethod(elem, 'setSelectionRange', [0, elem.value.length]);
        }
        this.focus.emit(null);
        this.service.onFocus(this);
      } else {
        if(this.focusedClass) {
          this.renderer.setElementClass(elem, this.focusedClass, false);
        }
        
        this.blur.emit(null);
        if(!this.noBlur) {
          this.service.onBlur(this);
        }         
      }
    }
  }

  descendentFocus(descendent: FocusDirective): boolean {
    if(!this.closedFocusedDescendent) {
      this.closedFocusedDescendent = descendent;
    } else {
      if(descendent.getAncestorDepth(this.closedFocusedDescendent) >= 0) {
        // descendent is ancestor of closestFocusedDescendent
        this.closedFocusedDescendent = descendent
      } else if(this.closedFocusedDescendent.getAncestorDepth(descendent) >= 0) {
        // closestFocusedDescendent is ancestor of descendent (ignore)
      } else {
        // descendent is not an ancestor of closedFocusedDescendent and is being focused
        // so closedFocusedDescendent needs to be blurred.
        // (we need this for directives that don't automatically blur themselves)
        this.closedFocusedDescendent.beBlurred();
        this.closedFocusedDescendent = descendent
      }
    }

    this.shouldBlur = false;
    this.setFocused(true);

    return true;
  }

  descendentBlur(descendent: FocusDirective): boolean {
    if(this.closedFocusedDescendent == descendent) {
      this.closedFocusedDescendent = null;
    }
    
    this.shouldBlur = true;

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
    return result;
  }
}