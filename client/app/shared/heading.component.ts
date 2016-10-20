import { Component, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { FocusDirective } from './focus.directive'

@Component({
  selector: 'cc-heading',
  directives: [FocusDirective],
  template: `
    <div class="heading editable">
      <input type="checkbox" info="heading" *ngIf="!editing" style="position: absolute;left:-1000px" (focus)="startEdit()" [tabindex]="editTabindex" />
      <h3 *ngIf="!editing" class="editable-display" (click)="startEdit()">{{value}}</h3>
      <input type="text" *ngIf="editing" cc-focus grab="true" highlight="true" [selectAll]="addMode" (blur)="endEdit()" [(ngModel)]="value" (ngModelChange)="valueChanged($event)" [tabindex]="editTabindex" />
    </div>
  `
}) 
export class HeadingComponent {
  @Input()
  value: string;

  @Input()
  editing: boolean;

  @Input()
  editTabindex: number;

  @Input()
  addMode: boolean;

  @ViewChild('focusable')
  focusable: FocusDirective;

  @Output()
  valueChange = new EventEmitter<string>();

  valueChanged(value: string) {
    this.valueChange.emit(value);
  }

  startEdit() {
    this.editing = true;
  }

  endEdit() {
    this.editing = false;
  }
}