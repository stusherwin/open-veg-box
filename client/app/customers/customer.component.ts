import { Component, Input, Output, EventEmitter, ViewChild, forwardRef, Inject } from '@angular/core';
import { Customer } from './customer'
import { HeadingComponent } from '../shared/heading.component'
import { FocusDirective } from '../shared/focus.directive'
import { CustomerAddressComponent } from './customer-address.component'
import { CustomerEmailComponent } from './customer-email.component'
import { CustomerTelComponent } from './customer-tel.component'

@Component({
  selector: 'cc-customer',
  templateUrl: 'app/customers/customer.component.html',
  directives: [HeadingComponent, FocusDirective, CustomerAddressComponent, CustomerEmailComponent, CustomerTelComponent],
})
export class CustomerComponent {
  adding: boolean;
  rowFocused: boolean;

  constructor() {
    this.resetCustomer();
  }

  @ViewChild('customerName')
  customerName: HeadingComponent;

  @ViewChild('addButton')
  addButton: FocusDirective;

  @Input()
  addMode: boolean;

  @Input()
  customer: Customer;

  @Input()
  index: number;

  @Input()
  showAddMessage: boolean;

  @Output()
  delete = new EventEmitter<Customer>();

  @Output()
  add = new EventEmitter<Customer>();
  
  @Output()
  update = new EventEmitter<Customer>();

  startAdd() {
    this.adding = true;
    this.customerName.startEdit();
  }

  completeAdd() {
    this.add.emit(this.customer);
    this.adding = false;
    this.resetCustomer();

    this.startAdd();
  }

  onDelete() {
    this.delete.emit(this.customer);
  }

  cancelAdd() {
    this.adding = false;
    this.resetCustomer();

    this.addButton.focusElement();
  } 

  clickEmail(event:any) {
    return true;
  }

  onUpdate() {
    if(!this.addMode) {
      this.update.emit(this.customer);
    }
  }

  onRowFocus() {
    var focusedChanged = !this.rowFocused;
    this.rowFocused = true;
    if(this.addMode && focusedChanged) {
      this.startAdd();
    }
  }

  onRowBlur() {
    if(this.adding) {
      this.adding = false;
      this.resetCustomer();
    }
    this.rowFocused = false;
  }

  resetCustomer() {
    this.customer = new Customer(0, 'New customer', '1 Some Street\nSomewhere\nSW12 3AB', '01234 567890', '', 'some.email@address.com');
  }
}