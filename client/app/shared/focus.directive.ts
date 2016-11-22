import {Component, Input, Directive, ElementRef, OnInit, Renderer, Host, Inject, forwardRef, Output, EventEmitter} from '@angular/core';
import {FocusService} from './focus.service';

@Directive({
  selector: '[cc-focus]',
  exportAs: 'cc-focus'
})
export class FocusDirective implements OnInit {
  constructor(
    private el: ElementRef, 
    private renderer: Renderer, 
    @Inject(forwardRef(() => FocusService))
    private service: FocusService) {
  }
  focused: boolean;
  shouldBlur: boolean;

  @Input()
  id: string;

  @Input()
  grab: boolean;

  @Input()
  noblur: boolean;

  @Input()
  focusedClass: string;

  @Input()
  selectAll: boolean;

  @Input()
  focusGroup: string;

  @Input()
  absorbEvents: boolean;

  @Output()
  ccFocus: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  ccBlur: EventEmitter<any> = new EventEmitter<any>();

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
      if(!this.noblur && !this.absorbEvents) {
        this.service.blur(this);
      }
    };

    if (this.grab) {
      this.renderer.invokeElementMethod(elem, 'focus', []);
    }
  }

  focus(selectText?: boolean) {
    selectText = selectText || false;
    var elem = this.el.nativeElement;
    setTimeout(() => {
      this.renderer.invokeElementMethod(elem, 'focus', []);
      if(selectText) {
        this.renderer.invokeElementMethod(elem, 'setSelectionRange', [0, elem.value.length]);
      }
    });
  }

  setFocused(focused: boolean) {
    let focusChanged = this.focused != focused;
    if(focusChanged) {
      this.focused = focused;
      if(this.focused) {
        if(this.focusedClass) {
          this.renderer.setElementClass(this.el.nativeElement, this.focusedClass, true);
        }
        this.ccFocus.emit(null);
      } else {
        if(this.focusedClass) {
          this.renderer.setElementClass(this.el.nativeElement, this.focusedClass, false);
        }
        
        this.ccBlur.emit(null); 
      }
    }
  }

  descendentFocus(descendent: any): boolean {
    this.shouldBlur = false;
    this.setFocused(true);
    if(this.absorbEvents) {
      this.service.focus(this);
      return false;
    }
    return true;
  }

  descendentBlur(descendent: any): boolean {
    this.shouldBlur = true;
    setTimeout(() => {
      if(this.shouldBlur) {
        this.setFocused(false);
        if(this.absorbEvents && !this.noblur) {
          this.service.blur(this);
        }
        this.shouldBlur = false;
      }
    }, 100);

    if(this.absorbEvents) {
      return false;
    }
    return true;
  }

  getAncestorDepth(element: FocusDirective): number {
    let depth = 0
    var ancestor = element.el.nativeElement;
    while(ancestor != null) {
      if(ancestor == this.el.nativeElement) {
        return depth;
      }
      ancestor = ancestor.parentNode;
      depth ++;
    }
    return -1;
  }
}