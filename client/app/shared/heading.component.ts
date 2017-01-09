import { Component, Input, ViewChild, ElementRef, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { FocusDirective } from './focus.directive'
import { EditableComponent } from '../shared/editable.component'

@Component({
  selector: 'cc-heading',
  directives: [FocusDirective, EditableComponent],
  template: `
    <cc-editable #editable className="heading" [tabindex]="editTabindex" (editStart)="onEditStart($event)" (editEnd)="onEditEnd($event)">
      <div display>
        <h3>{{value}}</h3>
      </div>
      <div edit>
        <input type="text" #focusable=cc-focus cc-focus [selectAll]="addMode" [(ngModel)]="value" (ngModelChange)="valueChanged($event)" [tabindex]="editTabindex" />
      </div>
    </cc-editable>
  `
}) 
export class HeadingComponent implements AfterViewInit {
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

  ngAfterViewInit() {
  }

  valueChanged(value: string) {
    this.valueChange.emit(value);
  }

  startEdit() {
    this.editable.startEdit();
  }

  onEditStart(tabbedInto: boolean) {
    this.focusable.beFocused();
  }

  onEditEnd(success: boolean) {
    this.update.emit(null);
  }
}