import { Component, OnInit, Input } from '@angular/core';
import { CustomersHomeComponent } from './customers-home.component'
import { EmailCustomerComponent } from './email-customer.component'
import { RouteConfig, Router, ROUTER_DIRECTIVES } from '@angular/router-deprecated';

@Component({
  selector: 'cc-customers',
  templateUrl: 'app/customers/customers.component.html',
  directives: [ROUTER_DIRECTIVES]
})

@RouteConfig([
  {
    path: '',
    name: 'CustomersHome',
    component: CustomersHomeComponent
  },
  {
    path: 'email/:customerId',
    name: 'Email',
    component: EmailCustomerComponent
  },
  {
    path: '/*anything-else',
    name: 'NotFound',
    redirectTo: ['CustomersHome']
  }
])
export class CustomersComponent {
}