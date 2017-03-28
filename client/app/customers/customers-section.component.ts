import { Component, OnInit, Input } from '@angular/core';
import { CustomersPageComponent } from './customers-page.component'
import { EmailPageComponent } from './email-page.component'
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
    component: CustomersPageComponent
  },
  {
    path: 'email/:customerId',
    name: 'Email',
    component: EmailPageComponent
  },
  {
    path: '/*anything-else',
    name: 'NotFound',
    redirectTo: ['./Customers']
  }
])
export class CustomersSectionComponent {
}