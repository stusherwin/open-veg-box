import {Component, Input, Directive, ElementRef, AfterViewInit, Renderer} from '@angular/core';
@Directive({
  selector: '[cc-focus]',
  exportAs: 'cc-focus'
})
export class FocusDirective implements AfterViewInit {
  constructor(private el: ElementRef, private renderer: Renderer) {}

  @Input()
  grab: boolean;

  @Input()
  highlight: boolean;

  @Input()
  selectAll: boolean;

  ngAfterViewInit() {
    var elem = this.el.nativeElement;
    
    var focusableParent: any = null;
    if (this.highlight) {
      // TODO: convert this into a parent directive
      var focusableParent: any = null;
      var parent = elem.parentNode;
      while(parent != null) {
        if(parent.attributes['cc-focusable']) {
          focusableParent = parent;
          break;
        }
        parent = parent.parentNode;
      }
    }

    elem.onfocus = () => {
      if(focusableParent) {
        focusableParent.className += ' focused';
      }

      if(this.selectAll) {
        this.renderer.invokeElementMethod(elem, 'setSelectionRange', [0, elem.value.length]);
      }
    };
      
    elem.onblur = () => {
      if(focusableParent) {
        var className = focusableParent.className;
        focusableParent.className = className.substring(0, className.length - ' focused'.length);
      }
    };

    if (this.grab) {
      this.renderer.invokeElementMethod(elem, 'focus', []);
    }
  }

  focus(selectText: boolean) {
    var elem = this.el.nativeElement;
    this.renderer.invokeElementMethod(elem, 'focus', []);
    if(selectText) {
      this.renderer.invokeElementMethod(elem, 'setSelectionRange', [0, elem.value.length]);
    }
  }
}