import { Component, OnInit, Input, Output, Inject, forwardRef, ViewChildren, QueryList, EventEmitter, ViewChild, ElementRef, Renderer, ChangeDetectorRef } from '@angular/core';
import { CustomerModel } from './customer.model'
import { OrderComponent } from '../orders/order.component'
import { MoneyPipe } from '../../shared/pipes'
import { Customer } from '../customer'
import { CustomerPageService } from './customer-page.component'
import { CustomerService } from '../customer.service'

@Component({
  selector: 'cc-orders-page',
  templateUrl: 'app/customers/customer-page/orders-page.component.html',
  directives: [OrderComponent],
  pipes: [MoneyPipe]
})
export class OrdersPageComponent implements OnInit {
  constructor(
      @Inject(forwardRef(() => CustomerPageService))
      private page: CustomerPageService,
      private customerService: CustomerService) {
  }

  ngOnInit() {
  }
}