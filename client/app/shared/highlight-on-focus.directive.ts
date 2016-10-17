import {Component, Directive, ElementRef} from '@angular/core';
@Directive({
  selector: '[ahighlightOnFocus]'
})
export class HighlightOnFocusDirective {
  constructor(private el: ElementRef) {}
  ngAfterViewInit() {
    console.log('highlightOnFocus:');
    console.log(this.el.nativeElement);
    this.el.nativeElement.onfocus = function() {console.log('focused'); };
  }
}