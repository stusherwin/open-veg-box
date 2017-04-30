import { Component, Input, ViewChild } from '@angular/core';
import { HeadingComponent } from '../../shared/heading.component'
import { CustomerAddressComponent } from './customer-address.component'
import { CustomerEmailComponent } from './customer-email.component'
import { CustomerTelComponent } from './customer-tel.component'
import { ROUTER_DIRECTIVES } from '@angular/router-deprecated';
import { ActiveElementDirective, ActivateOnFocusDirective, DeactivateOnBlurDirective } from '../../shared/active-elements'
import { CustomerModel } from './customer.model'
import { OrderComponent } from '../orders/order.component'
import { MoneyPipe } from '../../shared/pipes'

@Component({
  selector: 'cc-list-page-customer',
  templateUrl: 'app/customers/list-page/list-page-customer.component.html',
  directives: [HeadingComponent, CustomerAddressComponent, CustomerEmailComponent, CustomerTelComponent, ROUTER_DIRECTIVES, ActiveElementDirective, ActivateOnFocusDirective, DeactivateOnBlurDirective, OrderComponent],
  pipes: [MoneyPipe]
})
export class ListPageCustomerComponent {
  @ViewChild('customerName')
  customerName: HeadingComponent;

  @Input()
  model: CustomerModel;
}