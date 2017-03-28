import { Component, OnInit, Input } from '@angular/core';
import { RoundsPageComponent } from './rounds-page.component'
import { RoundPageComponent } from './round-page.component'
import { EmailPageComponent } from './email-page.component'
import { ProductListPageComponent } from './product-list-page.component'
import { OrderListPageComponent } from './order-list-page.component'
import { RouteParams } from '@angular/router-deprecated';
import { RouteConfig, Router, ROUTER_DIRECTIVES } from '@angular/router-deprecated';
import { ErrorNotifyComponent } from '../shared/error-notify.component'

@Component({
  selector: 'cc-rounds-section',
  templateUrl: 'app/rounds/rounds-section.component.html',
  directives: [ROUTER_DIRECTIVES, ErrorNotifyComponent]
})

@RouteConfig([
  {
    path: '',
    name: 'Rounds',
    component: RoundsPageComponent
  },
  {
    path: ':roundId',
    name: 'Round',
    component: RoundPageComponent
  },
  {
    path: ':roundId/email/',
    name: 'Email',
    component: EmailPageComponent
  },
  {
    path: ':roundId/product-list/',
    name: 'ProductList',
    component: ProductListPageComponent
  },
  {
    path: ':roundId/order-list/',
    name: 'OrderList',
    component: OrderListPageComponent
  },
  {
    path: '/*anything-else',
    name: 'NotFound',
    redirectTo: ['./Rounds']
  }
])
export class RoundsSectionComponent {
}