import { Component, Directive, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { FocusDirective } from '../shared/focus.directive'

@Component({
  selector: 'cc-customer-tel',
  directives: [FocusDirective],
  template: `
    <div class="editable" cc-focus (focus)="startEdit()" (blur)="endEdit()">
      <input type="checkbox" *ngIf="!editing" style="position: absolute;left:-1000px" cc-focus [tabindex]="editTabindex" />
      <div class="editable-display" *ngIf="!editing" (click)="startEdit()">
        {{ value }}
      </div>
      <div class="editable-edit" *ngIf="editing">
        <input type="text" [(ngModel)]="value" (ngModelChange)="valueChanged($event)" cc-focus grab="true" [selectAll]="addMode" [tabindex]="editTabindex" />
      </div>
    </div>
  `
})
export class CustomerTelComponent {
  @Input()
  editing: boolean;

  @Input()
  addMode: boolean;

  @Input()
  editTabindex: number;

  @Input()
  value: string;

  @Output()
  valueChange = new EventEmitter<string>();

  @Output()
  update = new EventEmitter<any>();

  startEdit() {
    this.editing = true;
  }

  endEdit() {
    this.editing = false;
    this.update.emit(null);
  }

  valueChanged(value: string) {
    this.valueChange.emit(value);
  }
}