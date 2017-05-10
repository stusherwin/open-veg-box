import { Component } from '@angular/core';
import { ListPageComponent } from './list-page/list-page.component'
import { CustomerPageComponent } from './customer-page/customer-page.component'
import { RouteConfig, ROUTER_DIRECTIVES } from '@angular/router-deprecated';

@Component({
  templateUrl: 'app/customers/customers-section.component.html',
  directives: [ROUTER_DIRECTIVES]
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
  }
])
export class CustomersSectionComponent {
}