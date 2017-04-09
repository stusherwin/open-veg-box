import { Component, OnInit, Input } from '@angular/core';
import { ListPageComponent } from './list-page/list-page.component'
import { CustomerPageComponent } from './customer-page/customer-page.component'
import { RouteConfig, Router, ROUTER_DIRECTIVES } from '@angular/router-deprecated';
import { ActiveService, ActiveElementDirective, ActivateOnFocusDirective } from '../shared/active-elements'

@Component({
  templateUrl: 'app/customers/customers-section.component.html',
  directives: [ROUTER_DIRECTIVES],
  providers: [ActiveService]
})

@RouteConfig([
  {
    path: '',
    name: 'Customers',
    component: ListPageComponent
  },
  {
    path: ':customerId/...',
    name: 'Customer',
    component: CustomerPageComponent
  },
  {
    path: '/*anything-else',
    name: 'NotFound',
    redirectTo: ['./Customers']
  }
])
export class CustomersSectionComponent {
}