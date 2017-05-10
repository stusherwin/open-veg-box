import { Component, Input, Output, EventEmitter, ViewChild, forwardRef, Inject, ElementRef, OnInit, Renderer, ViewChildren, QueryList } from '@angular/core';
import { Order, OrderItem } from './order'
import { OrderSectionComponent } from './order-section.component'
import { OrderService } from './order.service'
import { MoneyPipe } from '../../shared/pipes'
import { Product } from '../../products/product'
import { Box } from '../../boxes/box'
import { Arrays } from '../../shared/arrays';
import { OrderModel } from './order.model'

@Component({
  selector: 'cc-order',
  templateUrl: 'app/customers/orders/order.component.html',
  directives: [OrderSectionComponent],
  providers: [OrderService],
  pipes: [MoneyPipe]
})
export class OrderComponent implements OnInit {
  orderItemPadding = 10;
  model: OrderModel;

  @Input()
  order: Order;

  @Input()
  boxes: Box[];

  @Input()
  products: Product[];

  constructor(private orderService: OrderService) {
  }

  ngOnInit() {
    this.model = new OrderModel(
      this.order,
      this.boxes,
      this.products,
      this.orderService)
  }
}