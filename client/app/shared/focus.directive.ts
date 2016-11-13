import {Component, Input, Directive, ElementRef, OnInit, Renderer, Host, Inject, forwardRef} from '@angular/core';
import {HighlightableDirective} from './highlightable.directive';
import {HighlightService} from './highlight.service';

@Directive({
  selector: '[cc-focus]',
  exportAs: 'cc-focus'
})
export class FocusDirective implements OnInit {
  constructor(private el: ElementRef, private renderer: Renderer, private service: HighlightService) {
  }

  @Input()
  grab: boolean;

  @Input()
  highlight: HighlightableDirective;

  @Input()
  selectAll: boolean;

  ngOnInit() {
    var elem = this.el.nativeElement;

    elem.onfocus = () => {
      if(this.highlight) {
        this.service.highlight(this.el.nativeElement);
      }

      if(this.selectAll) {
        this.renderer.invokeElementMethod(elem, 'setSelectionRange', [0, elem.value.length]);
      }
    };
      
    elem.onblur = () => {
      if(this.highlight) {
        this.service.unHighlight(this.el.nativeElement);
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
    }, 0);
  }
}