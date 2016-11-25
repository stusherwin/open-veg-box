import { Component, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { FocusDirective } from './focus.directive'

@Component({
  selector: 'cc-heading',
  directives: [FocusDirective],
  template: `
    <div class="heading editable" cc-focus (ccFocus)="startEdit()" (ccBlur)="endEdit()">
      <input type="checkbox" *ngIf="!editing" style="position: absolute;left:-1000px" cc-focus [tabindex]="editTabindex" />
      <div class="editable-display" *ngIf="!editing">
        <h3 (click)="startEdit()">{{value}}</h3>
      </div>
      <div class="editable-edit" *ngIf="editing">
        <input type="text" cc-focus grab="true" [selectAll]="addMode" [(ngModel)]="value" (ngModelChange)="valueChanged($event)" [tabindex]="editTabindex" />
      </div>
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

  @Output()
  update = new EventEmitter<any>();

  valueChanged(value: string) {
    this.valueChange.emit(value);
  }

  startEdit() {
//    console.log('startEdit()');
 //   console.log('editing: ' + this.editing);
    this.editing = true;
  }

  endEdit() {
   // console.log('endEdit()');
    
    this.editing = false;
    this.update.emit(null);
  }
}