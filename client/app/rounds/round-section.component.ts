import { Component, OnInit, Input, Inject, forwardRef } from '@angular/core';
import { Round } from './round'
import { RoundService } from './round.service'
import { RoundPageComponent } from './round-page.component'
import { EmailPageComponent } from './email-page.component'
import { ProductListPageComponent } from './product-list-page.component'
import { OrderListPageComponent } from './order-list-page.component'
import { RouteParams } from '@angular/router-deprecated';
import { RouteConfig, ROUTER_DIRECTIVES } from '@angular/router-deprecated';
import { ErrorNotifyComponent } from '../shared/error-notify.component'
import { RoundPageHeaderComponent } from './round-page-header.component'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'

export class RoundSectionService {
  round: Round;
}

@Component({
  selector: 'cc-round-section',
  templateUrl: 'app/rounds/round-section.component.html',
  directives: [ROUTER_DIRECTIVES, ErrorNotifyComponent, RoundPageHeaderComponent],
  providers: [RoundSectionService]
})

@RouteConfig([
  {
    path: '',
    name: 'Details',
    component: RoundPageComponent
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
  },
  {
    path: '/*anything-else',
    name: 'NotFound',
    redirectTo: ['./Details']
  }
])
export class RoundSectionComponent implements OnInit {
  round: Round;

  constructor(
    private roundService: RoundService,
    private roundSectionService: RoundSectionService,
    private routeParams: RouteParams) {
  }

  ngOnInit() {
    let roundId = +this.routeParams.params['roundId'];
    this.roundService.get(roundId).subscribe(r => {
      this.roundSectionService.round = r;
      this.round = r;
    });
  }
}