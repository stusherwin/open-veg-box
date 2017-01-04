import { Component, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { FocusDirective } from './focus.directive'
import { EditableComponent } from '../shared/editable.component'

@Component({
  selector: 'cc-heading',
  directives: [FocusDirective, EditableComponent],
  template: `
    <cc-editable className="heading" [tabindex]="editTabindex" (startEdit)="startEdit()" (endEdit)="endEdit()">
      <div display>
        <h3>{{value}}</h3>
      </div>
      <div edit>
        <input type="text" #focusable=cc-focus cc-focus [selectAll]="addMode" [(ngModel)]="value" (ngModelChange)="valueChanged($event)" [tabindex]="editTabindex" />
      </div>
    </cc-editable>
  `
}) 
export class HeadingComponent {
  @Input()
  value: string;

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
    this.focusable.beFocused();
  }

  endEdit() {
    this.update.emit(null);
  }
}