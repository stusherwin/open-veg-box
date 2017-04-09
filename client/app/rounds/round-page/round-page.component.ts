import { Component, OnInit, Input, Inject, forwardRef } from '@angular/core';
import { Round } from '../round'
import { RoundService } from '../round.service'
import { RoundDetailsPageComponent } from './details-page.component'
import { EmailPageComponent } from './email-page.component'
import { ProductListPageComponent } from './product-list-page.component'
import { OrderListPageComponent } from './order-list-page.component'
import { RouteParams } from '@angular/router-deprecated';
import { RouteConfig, ROUTER_DIRECTIVES, Router } from '@angular/router-deprecated';
import { SectionHeaderComponent } from '../../structure/section-header.component'

export class RoundPageService {
  round: Round;
}

@Component({
  selector: 'cc-round-page',
  templateUrl: 'app/rounds/round-page/round-page.component.html',
  directives: [ROUTER_DIRECTIVES, SectionHeaderComponent],
  providers: [RoundPageService]
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

  constructor(
    private roundService: RoundService,
    private roundPageService: RoundPageService,
    private routeParams: RouteParams,
    private router: Router) {
  }

  ngOnInit() {
    let roundId = +this.routeParams.params['roundId'];
    this.roundService.get(roundId).subscribe(r => {
      this.roundPageService.round = r;
      this.round = r;
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