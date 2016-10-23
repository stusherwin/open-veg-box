import {Directive, ElementRef, AfterViewInit, Renderer, Inject, forwardRef} from '@angular/core';
import {HighlightService} from './highlight.service';

@Directive({
  selector: '[cc-highlightable]',
  exportAs: 'cc-highlightable',
})
export class HighlightableDirective implements AfterViewInit {
  constructor(
    private el: ElementRef,
    private renderer: Renderer, 
    @Inject(forwardRef(() => HighlightService))
    private service: HighlightService) {
  }

  ngAfterViewInit() {
    this.service.registerHighlightable(this);
  }

  highlight() {
    var className = this.el.nativeElement.className;
    if(!/\bfocused\b/.test(className)) {
      if(className.length == 0) {
        this.el.nativeElement.className = 'focused';   
      } else {
        this.el.nativeElement.className += ' focused';
      }
    }
  }

  unHighlight() {
    this.el.nativeElement.className = this.el.nativeElement.className.replace(/ focused\b/g, '').replace(/\bfocused /, '');
  }

  isAncestorOf(element: any) {
    var ancestor = element.parentNode;
    while(ancestor != null) {
      if(ancestor == this.el.nativeElement) {
        return true;
      }
      ancestor = ancestor.parentNode;
    }
    return false;
  }
}