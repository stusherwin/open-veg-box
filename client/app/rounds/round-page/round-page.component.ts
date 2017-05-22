import { Component, OnInit, Input, Inject, forwardRef } from '@angular/core';
import { Round, RoundService } from '../round.service'
import { Customer } from '../../customers/customer'
import { CustomerService } from '../../customers/customer.service'
import { RoundCustomersPageComponent } from './customers-page.component'
import { RoundDeliveriesPageComponent } from './deliveries-page.component'
import { EmailPageComponent } from './email-page.component'
import { RouteParams } from '@angular/router-deprecated';
import { RouteConfig, ROUTER_DIRECTIVES, Router } from '@angular/router-deprecated';
import { SectionHeaderComponent } from '../../structure/section-header.component'
import { Observable } from 'rxjs/Observable'
import 'rxjs/add/observable/combineLatest'
import { ButtonComponent } from '../../shared/button.component'
import { DeliveriesSectionComponent } from './deliveries-section.component'

export class RoundPageService {
  round: Round;
  unusedCustomers: Customer[] = []
}

@Component({
  selector: 'cc-round-page',
  templateUrl: 'app/rounds/round-page/round-page.component.html',
  directives: [ROUTER_DIRECTIVES, SectionHeaderComponent, ButtonComponent],
  providers: [RoundPageService]
})

@RouteConfig([
  {
    path: '',
    name: 'Customers',
    component: RoundCustomersPageComponent
  },
  // {
  //   path: 'deliveries',
  //   name: 'Deliveries',
  //   component: RoundDeliveriesPageComponent
  // },
  {
    path: 'email',
    name: 'Email',
    component: EmailPageComponent
  },
  {
    path: 'deliveries/...',
    name: 'Deliveries',
    component: DeliveriesSectionComponent
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

    console.log('here')
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