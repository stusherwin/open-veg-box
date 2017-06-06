import { Component, OnInit, Input, Output, Inject, forwardRef, ViewChildren, QueryList, EventEmitter, ViewChild, ElementRef, Renderer, ChangeDetectorRef } from '@angular/core';
import { CustomerModel } from './customer.model'
import { OrderComponent } from '../orders/order.component'
import { MoneyPipe, DateStringPipe, CountPipe } from '../../shared/pipes'
import { Customer } from '../customer'
import { CustomerPageService } from './customer-page.component'
import { CustomerService } from '../customer.service'
import { DateString } from '../../shared/dates'
import { ButtonComponent } from '../../shared/button.component'
import { ProductQuantityComponent } from '../../products/product-quantity.component'
import { ApiPastOrder, ApiPastOrderItem } from '../customer.service'

@Component({
  selector: 'cc-payments-page',
  templateUrl: 'app/customers/customer-page/payments-page.component.html',
  directives: [OrderComponent, ButtonComponent, ProductQuantityComponent],
  pipes: [MoneyPipe, DateStringPipe, CountPipe]
})
export class PaymentsPageComponent implements OnInit {
  constructor(
      @Inject(forwardRef(() => CustomerPageService))
      private page: CustomerPageService,
      private customerService: CustomerService) {
  }

  ngOnInit() {
  }
}