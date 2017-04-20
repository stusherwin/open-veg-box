import { Component, OnInit, Input, Renderer } from '@angular/core';
import { CustomerWithOrder } from '../customer'
import { Order } from '../orders/order'
import { CustomerService } from '../customer.service'
import { Box } from '../../boxes/box'
import { Product } from '../../products/product';
import { BoxService } from '../../boxes/box.service'
import { ProductService } from '../../products/product.service'
import { ListPageCustomerComponent } from './list-page-customer.component'
import { ListPageAddComponent } from './list-page-add.component'
import { Observable } from 'rxjs/Observable';
import { RouteParams } from '@angular/router-deprecated';
import { ActiveService, ActiveElementDirective, ActivateOnFocusDirective, DeactivateOnBlurDirective } from '../../shared/active-elements'
import { DistributeWidthService } from '../../shared/distribute-width.directive'
import { Arrays } from '../../shared/arrays';
import { Objects } from '../../shared/objects';
import { CustomerModel, AddCustomerModel } from './customer.model';
import { SectionHeaderComponent } from '../../structure/section-header.component'
import 'rxjs/add/observable/concat';
import 'rxjs/add/operator/last';

@Component({
  selector: 'cc-list-page',
  templateUrl: 'app/customers/list-page/list-page.component.html',
  directives: [ListPageCustomerComponent, ListPageAddComponent, ActiveElementDirective, ActivateOnFocusDirective, DeactivateOnBlurDirective, SectionHeaderComponent],
  providers: [CustomerService, BoxService, ProductService, ActiveService, DistributeWidthService]
})
export class ListPageComponent implements OnInit {
  constructor(private customerService: CustomerService, private boxService: BoxService, private productService: ProductService, routeParams: RouteParams, private renderer: Renderer) {
    this.queryParams = routeParams.params;

    this.addModel = {
      add: (properties: {[property: string]: any}) => {
        this.customerService.add(properties, Objects.extend(this.queryParams, {o: true})).subscribe(customers => {
          this.customers = customers.map(c => this.createModel(c));
          setTimeout(() => this.renderer.invokeElementMethod(window, 'scrollTo', [0, document.body.scrollHeight]));
        });
      }
    }
  }

  addModel: AddCustomerModel;
  customers: CustomerModel[] = [];
  loaded: boolean;

  queryParams: {[key: string]: string};

  ngOnInit() {
    this.customerService.getAllWithOrders(this.queryParams)
      .subscribe(customers => {
        this.loaded = true;
        this.customers = customers.map(c => this.createModel(c));
      });
  }

  createModel(customer: CustomerWithOrder): CustomerModel {
    return {
      id: customer.id,
      name: customer.name,
      address: customer.address,
      tel: customer.tel1,
      canEmail: customer.email && !!customer.email.length,
      orderTotal: customer.order.total,
      update: (params: any) => {
        this.customerService.update(customer.id, params, this.queryParams).subscribe(customers => {
        });
      },
      delete: () => {
        this.customerService.delete(customer.id, this.queryParams).subscribe(customers => {
          this.customers = customers.map(c => this.createModel(c));
        });
      }
    }
  }
}