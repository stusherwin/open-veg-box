import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Customer } from './customer';
import { SingleLinePipe } from '../shared/pipes';

@Component({
  selector: 'cc-customer-display',
  templateUrl: 'app/customers/customer-display.component.html',
  pipes: [SingleLinePipe]
})
export class CustomerDisplayComponent {
  @Input()
  customer: Customer;

  @Input()
  editDisabled: boolean;

  @Output()
  onEdit = new EventEmitter<Customer>();

  edit() {
    this.onEdit.emit(this.customer);
  } 
}