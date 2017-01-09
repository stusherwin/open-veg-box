import { Component, Directive, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { FocusDirective } from '../shared/focus.directive'
import { EditableComponent } from '../shared/editable.component'

@Component({
  selector: 'cc-customer-tel',
  directives: [FocusDirective, EditableComponent],
  template: `
    <cc-editable [tabindex]="editTabindex" (editStart)="onEditStart($event)" (editEnd)="onEditEnd($event)">
      <div display>
        {{ value }}
      </div>
      <div edit>
        <input type="text" [(ngModel)]="value" (ngModelChange)="valueChanged($event)" #focusable=cc-focus cc-focus [selectAll]="addMode" [tabindex]="editTabindex" />
      </div>
    </cc-editable>
  `
})
export class CustomerTelComponent {
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

  @ViewChild('focusable')
  focusable: FocusDirective;

  onEditStart(tabbedInto: boolean) {
    this.focusable.beFocused();
  }

  onEditEnd(success: boolean) {
    if(success) {
      this.update.emit(null);
    }
  }

  valueChanged(value: string) {
    this.valueChange.emit(value);
  }
}