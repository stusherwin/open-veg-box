import { Component, OnInit, Input, Inject, forwardRef } from '@angular/core';
import { Round } from '../round'
import { Customer } from '../../customers/customer'
import { RoundService } from '../round.service'
import { CustomerService } from '../../customers/customer.service'
import { RoundCustomersService } from '../list-page/round-customers.service'
import { RoundDetailsPageComponent } from './details-page.component'
import { EmailPageComponent } from './email-page.component'
import { ProductListPageComponent } from './product-list-page.component'
import { OrderListPageComponent } from './order-list-page.component'
import { RouteParams } from '@angular/router-deprecated';
import { RouteConfig, ROUTER_DIRECTIVES, Router } from '@angular/router-deprecated';
import { SectionHeaderComponent } from '../../structure/section-header.component'
import { Observable } from 'rxjs/Observable'
import 'rxjs/add/observable/combineLatest'

export class RoundPageService {
  round: Round;
  unusedCustomers: Customer[] = []
}

@Component({
  selector: 'cc-round-page',
  templateUrl: 'app/rounds/round-page/round-page.component.html',
  directives: [ROUTER_DIRECTIVES, SectionHeaderComponent],
  providers: [RoundPageService, RoundCustomersService]
})

@RouteConfig([
  {
    path: '',
    name: 'Details',
    component: RoundDetailsPageComponent
  },
  {
    path: 'email',
    name: 'Email',
    component: EmailPageComponent
  },
  {
    path: 'product-list',
    name: 'ProductList',
    component: ProductListPageComponent
  },
  {
    path: 'order-list',
    name: 'OrderList',
    component: OrderListPageComponent
  }
])
export class RoundPageComponent implements OnInit {
  round: Round;
  loading = true;

  constructor(
    private roundService: RoundService,
    private customerService: CustomerService,
    private page: RoundPageService,
    private routeParams: RouteParams,
    private router: Router) {
  }

  ngOnInit() {
    let roundId = +this.routeParams.params['roundId'];
    Observable.combineLatest(
      this.roundService.get(roundId),
      this.customerService.getAllWithNoRound({}),
      (round, customers) => ({round, customers}))
      .subscribe(({round, customers}) => {
      this.loading = false;
      this.page.round = round;
      this.round = round;
      this.page.unusedCustomers = customers;
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