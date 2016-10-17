import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { FocusDirective } from './focus.directive'

@Component({
  selector: 'cc-heading',
  directives: [FocusDirective],
  template: `
    <div class="heading editable">
      <input type="checkbox" *ngIf="!editing" style="position: absolute;left:-1000px" (focus)="startEdit()" />
      <h3 *ngIf="!editing" class="editable-display" (click)="startEdit()">{{value}}</h3>
      <input *ngIf="editing" cc-focus highlight="true" grab="true" (blur)="endEdit()" type="text" [value]="value" />
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