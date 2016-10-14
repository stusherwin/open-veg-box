import {Component, Directive, ElementRef} from '@angular/core';
@Directive({
  selector: '[grabFocus]'
})
export class GrabFocusDirective {
  constructor(private el: ElementRef) {}
  ngAfterViewInit() {
    this.el.nativeElement.focus();
  }
}