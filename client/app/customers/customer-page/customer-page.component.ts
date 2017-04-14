import { Component, OnInit, Input, Inject, forwardRef } from '@angular/core';
import { CustomerWithOrder } from '../customer'
import { CustomerService } from '../customer.service'
import { EmailPageComponent } from './email-page.component'
import { RouteParams } from '@angular/router-deprecated';
import { RouteConfig, ROUTER_DIRECTIVES, Router } from '@angular/router-deprecated';
import { SectionHeaderComponent } from '../../structure/section-header.component'
import { DetailsPageComponent } from './details-page.component'
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';
import { BoxService } from '../../boxes/box.service'
import { ProductService } from '../../products/product.service'
import { Box } from '../../boxes/box'
import { Product } from '../../products/product';
import { DistributeWidthService } from '../../shared/distribute-width.directive'

export class CustomerPageService {
  customer: CustomerWithOrder;
  boxes: Box[];
  products: Product[];
}

@Component({
  selector: 'cc-customer-page',
  templateUrl: 'app/customers/customer-page/customer-page.component.html',
  directives: [ROUTER_DIRECTIVES, SectionHeaderComponent],
  providers: [CustomerPageService, CustomerService, BoxService, ProductService, DistributeWidthService]
})

@RouteConfig([
  {
    path: '',
    name: 'Details',
    component: DetailsPageComponent
  },
  {
    path: 'email',
    name: 'Email',
    component: EmailPageComponent
  }
])
export class CustomerPageComponent implements OnInit {
  customer: CustomerWithOrder;
  loading = true;

  constructor(
    private customerService: CustomerService,
    private boxService: BoxService,
    private productService: ProductService,
    private page: CustomerPageService,
    private routeParams: RouteParams,
    private router: Router) {
  }

  ngOnInit() {
    let customerId = +this.routeParams.params['customerId'];
    Observable.combineLatest(
      this.customerService.getWithOrder(customerId),
      this.boxService.getAll({}),
      this.productService.getAll({}),
      (customer, boxes, products) => ({ customer, boxes, products })
    ).subscribe(({customer, boxes, products}) => {
      this.loading = false;
      this.customer = customer;
      this.page.customer = customer;
      this.page.boxes = boxes;
      this.page.products = products;
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