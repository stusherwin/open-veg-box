import { Component } from '@angular/core';
import { ListPageComponent } from './list-page/list-page.component'
import { CustomerPageComponent } from './customer-page/customer-page.component'
import { RouteConfig, ROUTER_DIRECTIVES } from '@angular/router-deprecated';
import { ActiveService } from '../shared/active-elements'

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
  }
])
export class CustomersSectionComponent {
}