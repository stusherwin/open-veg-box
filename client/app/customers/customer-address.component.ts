import { Component, Directive, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { FocusDirective } from '../shared/focus.directive'
import { SingleLinePipe } from '../shared/pipes';
import { EditableComponent } from '../shared/editable.component'

@Component({
  selector: 'cc-customer-address',
  directives: [FocusDirective, EditableComponent],
  pipes: [SingleLinePipe],
  template: `
    <cc-editable [tabindex]="editTabindex" (editStart)="onEditStart($event)" (editEnd)="onEditEnd($event)">
      <div display [innerHTML]="value | singleline:', '">
      </div>
      <div edit>
        <textarea [(ngModel)]="value" (ngModelChange)="valueChanged($event)" #focusable=cc-focus cc-focus [selectAll]="addMode" [tabindex]="editTabindex"></textarea>
      </div>
    </cc-editable>
  `
})
export class CustomerAddressComponent {
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