import { Component, OnInit, Input, Inject, forwardRef } from '@angular/core';
import { Customer } from '../customer'
import { CustomerService } from '../customer.service'
import { EmailPageComponent } from './email-page.component'
import { RouteParams } from '@angular/router-deprecated';
import { RouteConfig, ROUTER_DIRECTIVES, Router } from '@angular/router-deprecated';
import { SectionHeaderComponent } from '../../structure/section-header.component'

export class CustomerPageService {
  customer: Customer;
}

@Component({
  selector: 'cc-customer-page',
  templateUrl: 'app/customers/customer-page/customer-page.component.html',
  directives: [ROUTER_DIRECTIVES, SectionHeaderComponent],
  providers: [CustomerPageService, CustomerService]
})

@RouteConfig([
  // {
  //   path: '',
  //   name: 'Details',
  //   component: RoundDetailsPageComponent
  // },
  {
    path: 'email',
    name: 'Email',
    component: EmailPageComponent
  },
  {
    path: '/*anything-else',
    name: 'NotFound',
    redirectTo: ['./Email']
    // redirectTo: ['./Details']
  }
])
export class CustomerPageComponent implements OnInit {
  customer: Customer;

  constructor(
    private customerService: CustomerService,
    private customerPageService: CustomerPageService,
    private routeParams: RouteParams,
    private router: Router) {
  }

  ngOnInit() {
    let customerId = +this.routeParams.params['customerId'];
    this.customerService.get(customerId).subscribe(c => {
      this.customerPageService.customer = c;
      this.customer = c;
    });
  }

  isCurrent(linkParams: any[]): boolean {
    //router.isRouteActive() isn't working here for some reason :(
    //need to switch to the new router anyway.
    let cleanUp = (s:string) => s.replace(/;[^\/]+\/?$/, '');
    let pathname = cleanUp(this.router.generate(linkParams).toLinkUrl());
    let currentPathname = cleanUp(window.location.pathname);
    return currentPathname == pathname;
  }
}