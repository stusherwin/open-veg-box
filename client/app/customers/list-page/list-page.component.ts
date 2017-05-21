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
  directives: [ListPageCustomerComponent, ListPageAddComponent, SectionHeaderComponent],
  providers: [CustomerService, BoxService, ProductService, DistributeWidthService]
})
export class ListPageComponent implements OnInit {
  constructor(private customerService: CustomerService, private boxService: BoxService, private productService: ProductService, routeParams: RouteParams, private renderer: Renderer) {
    this.queryParams = routeParams.params;

    this.addModel = {
      add: (properties: {[property: string]: any}) => {
        this.customerService.add(properties).subscribe(id => {
          this.customers.unshift(new CustomerModel(id, properties['firstName'] + ' ' + properties['surname'], '', '', 0, this));
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
        this.customers = customers.map(c => new CustomerModel(c.id, c.name, c.address, c.email, c.order.total, this));
      });
  }

  delete(customer: CustomerModel) {
    this.customerService.delete(customer.id).subscribe(() => {
      Arrays.remove(this.customers, customer);
    });
  }
}