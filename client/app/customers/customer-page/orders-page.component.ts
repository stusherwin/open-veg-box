import { Component, OnInit, Input, Output, Inject, forwardRef, ViewChildren, QueryList, EventEmitter, ViewChild, ElementRef, Renderer, ChangeDetectorRef } from '@angular/core';
import { CustomerModel } from './customer.model'
import { OrderComponent } from '../orders/order.component'
import { MoneyPipe, DateStringPipe, CountPipe } from '../../shared/pipes'
import { Customer } from '../customer'
import { CustomerPageService } from './customer-page.component'
import { CustomerService } from '../customer.service'
import { DateString } from '../../shared/dates'
import { ButtonComponent } from '../../shared/button.component'
import { ProductQuantityComponent } from '../../products/product-quantity.component'
import { ApiPastOrder, ApiPastOrderItem } from '../customer.service'

export class PastOrderItemModel {
  name: string;
  price: number;
  quantity: number;
  unitType: string;
  totalCost: number;

  constructor(api: ApiPastOrderItem) {
    this.name = api.name;
    this.price = api.price;
    this.quantity = api.quantity;
    this.unitType = api.unitType;
    this.totalCost = api.totalCost;
  }
}

export class PastOrderModel {
  date: DateString
  totalCost: number
  boxes: PastOrderItemModel[];
  extraProducts: PastOrderItemModel[];
  boxCount: number;
  extraProductCount: number;

  constructor(api: ApiPastOrder) {
    this.date = DateString.fromJSONString(api.date);
    this.totalCost = api.totalCost;
    this.boxes = api.boxes.map(b => new PastOrderItemModel(b));
    this.boxCount = this.boxes.reduce((count, b) => count + b.quantity, 0);
    this.extraProducts = api.extraProducts.map(p => new PastOrderItemModel(p));
    this.extraProductCount = this.extraProducts.length;
  }
}

export class PastOrdersModel {
  pastOrders: PastOrderModel[] = []
  loading = true;

  ordersLoaded(pastOrders: ApiPastOrder[]) {
    this.pastOrders = pastOrders.map(o => new PastOrderModel(o));
    this.loading = false;
  }
}

@Component({
  selector: 'cc-orders-page',
  templateUrl: 'app/customers/customer-page/orders-page.component.html',
  directives: [OrderComponent, ButtonComponent, ProductQuantityComponent],
  pipes: [MoneyPipe, DateStringPipe, CountPipe]
})
export class OrdersPageComponent implements OnInit {
  model: PastOrdersModel

  constructor(
      @Inject(forwardRef(() => CustomerPageService))
      private page: CustomerPageService,
      private customerService: CustomerService) {
  }

  ngOnInit() {
    this.model = new PastOrdersModel();
    this.customerService.getPastOrders(this.page.customer.id)
      .subscribe(orders => this.model.ordersLoaded(orders))
  }
}