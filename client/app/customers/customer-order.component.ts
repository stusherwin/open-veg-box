import { Component, Input, Output, EventEmitter, ViewChild, forwardRef, Inject, ElementRef, OnInit, Renderer, ViewChildren, QueryList } from '@angular/core';
import { ActiveElementDirective } from '../shared/active-elements'
import { DistributeWidthDirective, DistributeWidthSumDirective } from './distribute-width.directive'
import { CustomerOrder, CustomerOrderItem } from './customer'
import { CustomerOrderSectionComponent } from './customer-order-section.component'
import { OrderService } from './order.service'
import { MoneyPipe } from '../shared/pipes'
import { Product } from '../products/product'
import { Box } from '../boxes/box'
import { Arrays } from '../shared/arrays';
import { CustomerOrderModel as HomeCustomerOrderModel } from './customers-home.component'
import { CustomerOrderModel, CustomerOrderAvailableItem } from './customer-order.model'
import { CustomerOrderItemModel } from './customer-order-item.model'

@Component({
  selector: 'cc-customer-order',
  templateUrl: 'app/customers/customer-order.component.html',
  directives: [ActiveElementDirective, DistributeWidthDirective, DistributeWidthSumDirective, CustomerOrderSectionComponent],
  providers: [OrderService],
  pipes: [MoneyPipe]
})
export class CustomerOrderComponent implements OnInit {
  orderItemPadding = 10;
  model: CustomerOrderModel;

  @Input()
  order: HomeCustomerOrderModel;

  @Input()
  tabindex: number;

  constructor(private orderService: OrderService) {
  }

  ngOnInit() {
    this.createModel(this.order.order);
  }

  createModel(order: CustomerOrder) {
    this.model = new CustomerOrderModel(
      order,
      this.order.boxes,
      this.order.products,
      (item: CustomerOrderAvailableItem, quantity: number) => {
        console.log('add box ' + item.id + '(' + quantity + ') to order ' + order.id);
        this.orderService.addBox(order.id, item.id, {quantity}).subscribe(o => {
          this.createModel(o);
        })
      },
      (item: CustomerOrderItemModel) => {
        console.log('update box ' + item.id + ' quantity to ' + item.quantity + ' on order ' + order.id);
        this.orderService.updateBox(order.id, item.id, {quantity: item.quantity}).subscribe(o => {
          this.createModel(o);
        })
      },
      (item: CustomerOrderItemModel) => {
        console.log('delete box ' + item.id + ' from order ' + order.id);
        this.orderService.removeBox(order.id, item.id).subscribe(o => {
          this.createModel(o);
        })
      },
      (item: CustomerOrderAvailableItem, quantity: number) => {
        console.log('add product ' + item.id + '(' + quantity + ') to order ' + order.id);
        this.orderService.addProduct(order.id, item.id, {quantity}).subscribe(o => {
          this.createModel(o);
        })
      },
      (item: CustomerOrderItemModel) => {
        console.log('update product ' + item.id + ' quantity to ' + item.quantity + ' on order ' + order.id);
        this.orderService.updateProduct(order.id, item.id, {quantity: item.quantity}).subscribe(o => {
          this.createModel(o);
        })
      },
      (item: CustomerOrderItemModel) => {
        console.log('delete product ' + item.id + ' from order ' + order.id);
        this.orderService.removeProduct(order.id, item.id).subscribe(o => {
          this.createModel(o);
        })
      }
    )
  }
}