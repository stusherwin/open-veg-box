import { Component, OnInit, Input, Renderer } from '@angular/core';
import { CustomerWithOrder } from './customer'
import { Order } from './orders/order'
import { CustomerService } from './customer.service'
import { Box } from '../boxes/box'
import { Product } from '../products/product';
import { BoxService } from '../boxes/box.service'
import { ProductService } from '../products/product.service'
import { CustomerComponent } from './customer.component'
import { CustomerAddComponent } from './customer-add.component'
import { Observable } from 'rxjs/Observable';
import { RouteParams } from '@angular/router-deprecated';
import { ActiveService, ActiveElementDirective, ActivateOnFocusDirective, DeactivateOnBlurDirective } from '../shared/active-elements'
import { DistributeWidthService } from './distribute-width.directive'
import { Arrays } from '../shared/arrays';
import { Objects } from '../shared/objects';
import 'rxjs/add/observable/concat';
import 'rxjs/add/operator/last';

@Component({
  selector: 'cc-customers-home',
  templateUrl: 'app/customers/customers-home.component.html',
  directives: [CustomerComponent, CustomerAddComponent, ActiveElementDirective, ActivateOnFocusDirective, DeactivateOnBlurDirective],
  providers: [CustomerService, BoxService, ProductService, ActiveService, DistributeWidthService]
})
export class CustomersHomeComponent implements OnInit {
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
  boxes: Box[];
  products: Product[];
  loaded: boolean;

  queryParams: {[key: string]: string};

  ngOnInit() {
    this.customerService.getAllWithOrders(this.queryParams).combineLatest(
        this.boxService.getAll(this.queryParams),
        this.productService.getAll(this.queryParams),
        (customers, boxes, products) => ({ customers, boxes, products }))
      .subscribe(({customers, boxes, products}) => {
        this.loaded = true;
        this.boxes = boxes;
        this.products = products;
        this.customers = customers.map(c => this.createModel(c));
      });
  }

  createModel(customer: CustomerWithOrder): CustomerModel {
    return {
      name: customer.name,
      address: customer.address,
      email: customer.email,
      tel1: customer.tel1,
      order: {
        order: customer.order,
        boxes: this.boxes,
        products: this.products
      },
      emailRouterLink: ['../Email', {customerId: customer.id}],
      delete: () => {
        this.customerService.delete(customer.id, this.queryParams).subscribe(customers => {
          this.customers = customers.map(c => this.createModel(c));
        });
      },
      update: (properties: {[property: string]: any}) => {
        console.log('update customer ' + customer.id + ':');
        console.log(properties);
        this.customerService.update(customer.id, properties, this.queryParams).subscribe(customers => {
        });
      }
    }
  }
}

export class CustomerModel {
  name: string;
  address: string;
  tel1: string;
  email: string;
  order: OrderModel;
  emailRouterLink: any[];

  delete: () => void;
  update: (properties: {[property: string]: any}) => void;
}

export class OrderModel {
  order: Order;
  boxes: Box[];
  products: Product[];
}

export class AddCustomerModel {
  add: (properties: {[property: string]: any}) => void;
}