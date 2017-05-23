import { Component, OnInit, Input } from '@angular/core';
import { RoundDeliveriesPageComponent } from './deliveries-page.component'
import { DeliveryPageComponent } from './delivery-page.component'
import { RouteParams } from '@angular/router-deprecated';
import { RouteConfig, Router, ROUTER_DIRECTIVES } from '@angular/router-deprecated';
import { ProductListPageComponent } from './product-list-page.component'
import { OrderListPageComponent } from './order-list-page.component'

@Component({
  selector: 'cc-deliveries-section',
  templateUrl: 'app/rounds/round-page/deliveries-section.component.html',
  directives: [ROUTER_DIRECTIVES],
})

@RouteConfig([
  {
    path: '',
    name: 'Deliveries',
    component: RoundDeliveriesPageComponent
  },
  {
    path: ':deliveryId/...',
    name: 'Delivery',
    component: DeliveryPageComponent
  },
  {
    path: 'order-list',
    name: 'OrderList',
    component: OrderListPageComponent
  },
  {
    path: 'product-list',
    name: 'ProductList',
    component: ProductListPageComponent
  }
])
export class DeliveriesSectionComponent {
}