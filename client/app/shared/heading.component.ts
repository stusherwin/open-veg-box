import { Component, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { FocusDirective } from './focus.directive'
import { EditableComponent } from '../shared/editable.component'

@Component({
  selector: 'cc-heading',
  directives: [FocusDirective, EditableComponent],
  template: `
    <cc-editable #editable className="heading" [tabindex]="editTabindex" (editStart)="onEditStart()" (editEnd)="onEditEnd()">
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

  @ViewChild('editable')
  editable: EditableComponent;

  @Output()
  valueChange = new EventEmitter<string>();

  @Output()
  update = new EventEmitter<any>();

  valueChanged(value: string) {
    this.valueChange.emit(value);
  }

  startEdit() {
    this.editable.startEdit();
  }

  onEditStart() {
    this.focusable.beFocused();
  }

  onEditEnd() {
    this.update.emit(null);
  }
}