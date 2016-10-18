import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { FocusDirective } from './focus.directive'

@Component({
  selector: 'cc-heading',
  directives: [FocusDirective],
  template: `
    <div class="heading editable">
      <input type="checkbox" *ngIf="!editing" style="position: absolute;left:-1000px" (focus)="startEdit()" />
      <h3 *ngIf="!editing" class="editable-display" (click)="startEdit()">{{value}}</h3>
      <input type="text" *ngIf="editing" cc-focus grab="true" highlight="true" [selectAll]="addMode" (blur)="endEdit()" [value]="value" />
    </div>
  `
})
export class HeadingComponent {
  @Input()
  value: string;

  @Input()
  editing: boolean;

  @Input()
  addMode: boolean;

  @ViewChild('focusable')
  focusable: FocusDirective;

  startEdit() {
    this.editing = true;
  }

  endEdit() {
    this.editing = false;
  }
}