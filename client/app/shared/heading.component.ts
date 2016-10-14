import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { GrabFocusDirective } from './grab-focus.directive'

@Component({
  selector: 'cc-heading',
  directives: [GrabFocusDirective],
  template: `
    <div class="heading">
      <input type="checkbox" style="position: absolute;left:-1000px" (focus)="startEdit()" />
      <h3 *ngIf="!editing" (click)="startEdit()">{{value}}</h3>
      <input *ngIf="editing" grabFocus (blur)="endEdit()" type="text" [value]="value" />
    </div>
  `
})
export class HeadingComponent {
  @Input()
  value: string;

  @Input()
  editing: boolean;

  startEdit() {
    this.editing = true;
  }

  endEdit() {
    this.editing = false;
  }
}