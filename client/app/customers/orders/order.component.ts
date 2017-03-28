import { Component, Input, Output, EventEmitter, ViewChild, forwardRef, Inject, ElementRef, OnInit, Renderer, ViewChildren, QueryList } from '@angular/core';
import { ActiveElementDirective } from '../../shared/active-elements'
import { DistributeWidthDirective, DistributeWidthSumDirective } from '../distribute-width.directive'
import { Order, OrderItem } from './order'
import { OrderSectionComponent } from './order-section.component'
import { OrderService } from './order.service'
import { MoneyPipe } from '../../shared/pipes'
import { Product } from '../../products/product'
import { Box } from '../../boxes/box'
import { Arrays } from '../../shared/arrays';
import { CustomerOrderModel } from '../customer.model'
import { OrderModel, OrderAvailableItem } from './order.model'
import { OrderItemModel } from './order-item.model'

@Component({
  selector: 'cc-order',
  templateUrl: 'app/customers/orders/order.component.html',
  directives: [ActiveElementDirective, DistributeWidthDirective, DistributeWidthSumDirective, OrderSectionComponent],
  providers: [OrderService],
  pipes: [MoneyPipe]
})
export class OrderComponent implements OnInit {
  orderItemPadding = 10;
  model: OrderModel;

  @Input()
  customerOrder: CustomerOrderModel;

  @Input()
  tabindex: number;

  constructor(private orderService: OrderService) {
  }

  ngOnInit() {
    this.createModel(this.customerOrder.order);
  }

  createModel(order: Order) {
    this.model = new OrderModel(
      order,
      this.customerOrder.boxes,
      this.customerOrder.products,
      (item: OrderAvailableItem, quantity: number) => {
        console.log('add box ' + item.id + '(' + quantity + ') to order ' + order.id);
        this.orderService.addBox(order.id, item.id, {quantity}).subscribe(o => {
          this.createModel(o);
        })
      },
      (item: OrderItemModel) => {
        console.log('update box ' + item.id + ' quantity to ' + item.quantity + ' on order ' + order.id);
        this.orderService.updateBox(order.id, item.id, {quantity: item.quantity}).subscribe(o => {
          this.createModel(o);
        })
      },
      (item: OrderItemModel) => {
        console.log('delete box ' + item.id + ' from order ' + order.id);
        this.orderService.removeBox(order.id, item.id).subscribe(o => {
          this.createModel(o);
        })
      },
      (item: OrderAvailableItem, quantity: number) => {
        console.log('add product ' + item.id + '(' + quantity + ') to order ' + order.id);
        this.orderService.addProduct(order.id, item.id, {quantity}).subscribe(o => {
          this.createModel(o);
        })
      },
      (item: OrderItemModel) => {
        console.log('update product ' + item.id + ' quantity to ' + item.quantity + ' on order ' + order.id);
        this.orderService.updateProduct(order.id, item.id, {quantity: item.quantity}).subscribe(o => {
          this.createModel(o);
        })
      },
      (item: OrderItemModel) => {
        console.log('delete product ' + item.id + ' from order ' + order.id);
        this.orderService.removeProduct(order.id, item.id).subscribe(o => {
          this.createModel(o);
        })
      }
    )
  }
}