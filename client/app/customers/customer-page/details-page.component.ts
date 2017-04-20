import { Component, OnInit, Input, Inject, forwardRef } from '@angular/core';
import { CustomerAddressComponent } from '../list-page/customer-address.component'
import { CustomerEmailComponent } from '../list-page/customer-email.component'
import { CustomerTelComponent } from '../list-page/customer-tel.component'
import { ActiveElementDirective } from '../../shared/active-elements'
import { CustomerModel } from './customer.model'
import { OrderComponent } from '../orders/order.component'
import { MoneyPipe } from '../../shared/pipes'
import { Customer } from '../customer'
import { CustomerPageService } from './customer-page.component'
import { CustomerService } from '../customer.service'

@Component({
  selector: 'cc-details-page',
  templateUrl: 'app/customers/customer-page/details-page.component.html',
  directives: [CustomerAddressComponent, CustomerEmailComponent, CustomerTelComponent, OrderComponent, ActiveElementDirective]
})
export class DetailsPageComponent implements OnInit {
  model: CustomerModel;

  constructor(
    @Inject(forwardRef(() => CustomerPageService))
    private page: CustomerPageService,
    private customerService: CustomerService) {
    this.model = new CustomerModel(page.customer, customerService);
  }

  ngOnInit() {
  }
}