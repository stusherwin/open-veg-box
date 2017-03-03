import { Component, Input, Output, EventEmitter, ViewChild, forwardRef, Inject, ElementRef, OnInit } from '@angular/core';
import { Customer } from './customer'
import { HeadingComponent } from '../shared/heading.component'
import { CustomerAddressComponent } from './customer-address.component'
import { CustomerEmailComponent } from './customer-email.component'
import { CustomerTelComponent } from './customer-tel.component'
import { ROUTER_DIRECTIVES } from '@angular/router-deprecated';
import { ActiveElementDirective, ActivateOnFocusDirective, DeactivateOnBlurDirective } from '../shared/active-elements'
import { DistributeWidthDirective } from './distribute-width.directive'

@Component({
  selector: 'cc-customer',
  templateUrl: 'app/customers/customer.component.html',
  directives: [HeadingComponent, CustomerAddressComponent, CustomerEmailComponent, CustomerTelComponent, ROUTER_DIRECTIVES, ActiveElementDirective, ActivateOnFocusDirective, DeactivateOnBlurDirective, DistributeWidthDirective],
})
export class CustomerComponent {
  rowFocused: boolean;

  @ViewChild('customerName')
  customerName: HeadingComponent;

  @Input()
  customer: Customer;

  @Input()
  index: number;

  @ViewChild('active')
  active: ActiveElementDirective;

  @Output()
  delete = new EventEmitter<Customer>();

  @Output()
  update = new EventEmitter<Customer>();

  onDelete() {
    this.delete.emit(this.customer);
    this.active.makeInactive();
  }

  clickEmail(event:any) {
    return true;
  }

  onUpdate() {
    this.update.emit(this.customer);
  }

  onActivate() {
    this.rowFocused = true;
  }

  onDeactivate() {
    this.rowFocused = false;
  }
}