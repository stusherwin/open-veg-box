import {Component, Input, Directive, ElementRef} from '@angular/core';
@Directive({
  selector: '[cc-focus]'
})
export class FocusDirective {
  constructor(private el: ElementRef) {}

  @Input()
  grab: boolean;

  @Input()
  highlight: boolean;

  ngAfterViewInit() {
    var highlight = this.highlight !== undefined;
    if (highlight) {
      // TODO: convert this into a parent directive
      var focusableParent: any = null;
      var parent = this.el.nativeElement.parentNode;
      while(parent != null) {
        if(parent.attributes['cc-focusable']) {
          focusableParent = parent;
          break;
        }
        parent = parent.parentNode;
      }

      if( focusableParent) {
        this.el.nativeElement.onfocus = () => {
          focusableParent.className += ' focused';
        };
        
        this.el.nativeElement.onblur = () => {
          var className = focusableParent.className;
          focusableParent.className = className.substring(0, className.length - ' focused'.length);
        };
      }
    }

    var grab = this.grab !== undefined;
    if (grab) {
      this.el.nativeElement.focus();
    }
  }

}