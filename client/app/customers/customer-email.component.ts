import { Component, Directive, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { FocusDirective } from '../shared/focus.directive'
import { EditableComponent } from '../shared/editable.component'

@Component({
  selector: 'cc-customer-email',
  directives: [FocusDirective, EditableComponent],
  template: `
    <cc-editable [tabindex]="editTabindex" (editStart)="onEditStart()" (editEnd)="onEditEnd()">
      <div display>
        {{ value }}
      </div>
      <div edit>
        <input type="text" [(ngModel)]="value" (ngModelChange)="valueChanged($event)" #focusable=cc-focus cc-focus [selectAll]="addMode" [tabindex]="editTabindex" />
      </div>
    </cc-editable>
  `
})
export class CustomerEmailComponent {
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
  
  onEditStart() {
    this.focusable.beFocused();
  }

  onEditEnd() {
    this.update.emit(null);
  }

  valueChanged(value: string) {
    this.valueChange.emit(value);
  }
}