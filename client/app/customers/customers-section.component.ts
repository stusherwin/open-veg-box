import { Component, OnInit, Input } from '@angular/core';
import { ListPageComponent } from './list-page/list-page.component'
import { EmailPageComponent } from './customer-page/email-page.component'
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