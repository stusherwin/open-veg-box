import { Component, OnInit, Input, Inject, forwardRef } from '@angular/core';
import { Delivery, RoundService } from '../round.service'
import { DeliveryProductListPageComponent } from './delivery-product-list-page.component'
import { DeliveryOrderListPageComponent } from './delivery-order-list-page.component'
import { RouteParams } from '@angular/router-deprecated';
import { RouteConfig, ROUTER_DIRECTIVES, Router } from '@angular/router-deprecated';
import { SectionHeaderComponent } from '../../structure/section-header.component'
import { Observable } from 'rxjs/Observable'
import 'rxjs/add/observable/combineLatest'
import { ButtonComponent } from '../../shared/button.component'
import { RoundPageService } from './round-page.component'

export class DeliveryPageService {
  delivery: Delivery;
}

@Component({
  selector: 'cc-delivery-page',
  templateUrl: 'app/rounds/round-page/delivery-page.component.html',
  directives: [ROUTER_DIRECTIVES, SectionHeaderComponent, ButtonComponent],
  providers: [DeliveryPageService]
})

@RouteConfig([
  {
    path: 'order-list',
    name: 'OrderList',
    component: DeliveryOrderListPageComponent
  },
  {
    path: 'product-list',
    name: 'ProductList',
    component: DeliveryProductListPageComponent
  }
])
export class DeliveryPageComponent implements OnInit {
  delivery: Delivery;
  loading = true;

  constructor(
    private roundService: RoundService,
    @Inject(forwardRef(() => RoundPageService))
    private roundPage: RoundPageService,
    private page: DeliveryPageService,
    private routeParams: RouteParams,
    private router: Router) {
  }

  ngOnInit() {
    let deliveryId = +this.routeParams.params['deliveryId'];
      this.roundService.getDelivery(this.roundPage.round.id, deliveryId)
      .subscribe(delivery => {
        this.loading = false;
        this.page.delivery = delivery;
        this.delivery = delivery;
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