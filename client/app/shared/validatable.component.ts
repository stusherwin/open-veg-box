import { Component, Input, ViewChild, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'cc-validatable',
  template: `
    <span class="input-wrapper" [class.invalid]="!valid"><ng-content></ng-content>
    <i *ngIf="!valid" class="icon-warning" title="{{message}}"></i></span>
  `
})
export class ValidatableComponent {
  @Input()
  valid: boolean;

  @Input()
  message: string

  onChange(event: any) {
    console.log(event);
  }
}