import {Component, Input, Directive, ElementRef, OnInit, Renderer, Host, Inject, forwardRef, Output, EventEmitter} from '@angular/core';
import {ClickOutsideService} from './click-outside.service';

const BLUR_GRACE_PERIOD_MS: number = 100;

@Directive({
  selector: '[cc-click-outside]',
  exportAs: 'cc-click-outside',
  host: {
    '(document:click)': 'onClickOutside($event)',
  }
})
export class ClickOutsideDirective {
  constructor(
    private el: ElementRef, 
    @Inject(forwardRef(() => ClickOutsideService))
    private service: ClickOutsideService) {
  }

  onClickOutside(event: MouseEvent) {
    if(event.clientX > 0 && event.clientY > 0) {
      setTimeout(() => this.service.outsideClick(event.clientX, event.clientY));
    }
  }
}