import { Component, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { FocusDirective } from './focus.directive'

@Component({
  selector: 'cc-heading',
  directives: [FocusDirective],
  template: `
    <div class="heading editable">
      <input type="checkbox" *ngIf="!editing" style="position: absolute;left:-1000px" (focus)="startEdit()" [tabindex]="editTabindex" />
      <div class="editable-display" *ngIf="!editing">
        <h3 (click)="startEdit()">{{value}}</h3>
      </div>
      <div class="editable-edit" *ngIf="editing">
        <input type="text" cc-focus grab="true" highlight="true" [selectAll]="addMode" (blur)="endEdit()" [(ngModel)]="value" (ngModelChange)="valueChanged($event)" [tabindex]="editTabindex" />
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
  focus = new EventEmitter<any>();

  @Output()
  blur = new EventEmitter<any>();

  @Output()
  update = new EventEmitter<any>();

  valueChanged(value: string) {
    this.valueChange.emit(value);
  }

  startEdit() {
    this.focus.emit({type: "focus", srcElement: this});
    this.editing = true;
  }

  endEdit() {
    console.log('endEdit()');
    this.editing = false;
    this.blur.emit({type: "blur", srcElement: this});
    this.update.emit(null);
  }
}