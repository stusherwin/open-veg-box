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
  absorbEvents: boolean;

  @Output()
  focus: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  blur: EventEmitter<any> = new EventEmitter<any>();

  ngOnInit() {
    this.service.register(this);

    var elem = this.el.nativeElement;

    elem.onfocus = () => {
      this.setFocused(true);

      if(!this.absorbEvents) {
        this.service.focus(this);
      }

      if(this.selectAll) {
        this.renderer.invokeElementMethod(elem, 'setSelectionRange', [0, elem.value.length]);
      }
    };
      
    elem.onblur = () => {
      this.setFocused(false);

      if(!this.absorbEvents) {
        this.service.blur(this);
      }
    };

    if (this.grab) {
      this.renderer.invokeElementMethod(elem, 'focus', []);
    }
  }

  focusElement() {
    setTimeout(() => this.renderer.invokeElementMethod(this.el.nativeElement, 'focus', []));
  }

  setFocused(focused: boolean) {
    let focusChanged = this.focused != focused;
    if(focusChanged) {
      this.focused = focused;
      if(this.focused) {
        if(this.focusedClass) {
          this.renderer.setElementClass(this.el.nativeElement, this.focusedClass, true);
        }
        this.focus.emit(null);
      } else {
        if(this.focusedClass) {
          this.renderer.setElementClass(this.el.nativeElement, this.focusedClass, false);
        }
        
        this.blur.emit(null); 
      }
    }
  }

  descendentFocus(): boolean {
    this.shouldBlur = false;

    this.setFocused(true);

    if(this.absorbEvents) {
      this.service.focus(this);
      return false;
    }

    return true;
  }

  descendentBlur(): boolean {
    this.shouldBlur = true;

    setTimeout(() => {
      if(this.shouldBlur) {
        this.setFocused(false);

        if(this.absorbEvents) {
          this.service.blur(this);
        }

        this.shouldBlur = false;
      }
    }, BLUR_GRACE_PERIOD_MS);

    if(this.absorbEvents) {
      return false;
    }

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
}