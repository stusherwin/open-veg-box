import {Directive, ElementRef, OnInit, Renderer, Inject, forwardRef} from '@angular/core';
import {HighlightService} from './highlight.service';

@Directive({
  selector: '[cc-highlightable]',
  exportAs: 'cc-highlightable',
})
export class HighlightableDirective implements OnInit {
  constructor(
    private el: ElementRef,
    private renderer: Renderer, 
    @Inject(forwardRef(() => HighlightService))
    private service: HighlightService) {
  }

  ngOnInit() {
    this.service.registerHighlightable(this);
  }

  highlight() {
    this.renderer.setElementClass(this.el.nativeElement, 'focused', true); 
  }

  unHighlight() {
    this.renderer.setElementClass(this.el.nativeElement, 'focused', false); 
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