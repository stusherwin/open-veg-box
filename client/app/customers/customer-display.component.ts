import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Customer } from './customer';

@Component({
  selector: 'cc-customer-display',
  templateUrl: 'app/customers/customer-display.component.html',
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