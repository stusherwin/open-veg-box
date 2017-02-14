import { Component, Input, Output, EventEmitter, ViewChild, forwardRef, Inject, ElementRef } from '@angular/core';
import { Customer } from './customer'
import { HeadingComponent } from '../shared/heading.component'
import { CustomerAddressComponent } from './customer-address.component'
import { CustomerEmailComponent } from './customer-email.component'
import { CustomerTelComponent } from './customer-tel.component'
import { ROUTER_DIRECTIVES } from '@angular/router-deprecated';
import { ActiveElementDirective, ActivateOnFocusDirective, DeactivateOnBlurDirective } from '../shared/active-elements'

@Component({
  selector: 'cc-customer',
  templateUrl: 'app/customers/customer.component.html',
  directives: [HeadingComponent, CustomerAddressComponent, CustomerEmailComponent, CustomerTelComponent, ROUTER_DIRECTIVES, ActiveElementDirective, ActivateOnFocusDirective, DeactivateOnBlurDirective],
})
export class CustomerComponent {
  adding: boolean;
  rowFocused: boolean;

  constructor() {
    this.resetCustomer();
  }

  @ViewChild('customerName')
  customerName: HeadingComponent;

  @ViewChild('add')
  addButton: ElementRef;

  @Input()
  addMode: boolean;

  @Input()
  customer: Customer;

  @Input()
  index: number;

  @Input()
  showAddMessage: boolean;

  @Input()
  loaded: boolean;

  @ViewChild('active')
  active: ActiveElementDirective;

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
    this.active.makeInactive();
  }

  onDelete() {
    this.delete.emit(this.customer);
    this.active.makeInactive();
  }

  cancelAdd() {
    this.adding = false;
    this.resetCustomer();
    this.active.makeInactive();
  } 

  clickEmail(event:any) {
    return true;
  }

  onUpdate() {
    if(!this.addMode) {
      this.update.emit(this.customer);
    }
  }

  onActivate() {
    this.rowFocused = true;
  }

  onDeactivate() {
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