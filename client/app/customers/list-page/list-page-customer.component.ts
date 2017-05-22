import { Component, Input, ViewChild } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router-deprecated';
import { CustomerModel } from './customer.model'
import { OrderComponent } from '../orders/order.component'
import { MoneyPipe } from '../../shared/pipes'
import { ButtonComponent } from '../../shared/button.component'

@Component({
  selector: 'cc-list-page-customer',
  templateUrl: 'app/customers/list-page/list-page-customer.component.html',
  directives: [ROUTER_DIRECTIVES, OrderComponent, ButtonComponent],
  pipes: [MoneyPipe]
})
export class ListPageCustomerComponent {
  @Input()
  model: CustomerModel;
}