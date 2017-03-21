import { Component, Input, Output, EventEmitter, ViewChild, forwardRef, Inject, ElementRef, OnInit, Renderer, ViewChildren, QueryList } from '@angular/core';
import { ActiveElementDirective } from '../shared/active-elements'
import { DistributeWidthDirective, DistributeWidthSumDirective } from './distribute-width.directive'
import { CustomerOrder } from './customer'
import { CustomerOrderModel } from './customers-home.component'
import { CustomerOrderSectionComponent } from './customer-order-section.component'
import { OrderService } from './order.service'
import { MoneyPipe } from '../shared/pipes'
import { Product } from '../products/product'
import { Box } from '../boxes/box'
import { Arrays } from '../shared/arrays';

@Component({
  selector: 'cc-customer-order',
  templateUrl: 'app/customers/customer-order.component.html',
  directives: [ActiveElementDirective, DistributeWidthDirective, DistributeWidthSumDirective, CustomerOrderSectionComponent],
  providers: [OrderService],
  pipes: [MoneyPipe]
})
export class CustomerOrderComponent implements OnInit {
  orderItemPadding = 10;
  addTotal = 0;
  boxesModel: CustomerOrderSectionModel;
  productsModel: CustomerOrderSectionModel;

  @Input()
  model: CustomerOrderModel;

  @Input()
  tabindex: number;

  constructor(private orderService: OrderService) {
  }

  ngOnInit() {
    this.createModels(this.model.order);
    console.log(this.model.order);
    console.log(this.addTotal);
  }

  createModels(order: CustomerOrder) {
    this.model.order = order;
    this.productsModel = {
      itemsAvailable: Arrays.exceptByOther(
        this.model.products, p => p.id,
        order.extraProducts, p => p.id),
      items: order.extraProducts.map(p => ({
        id: p.id,
        name: p.name,
        price: p.total / p.quantity,
        quantity: p.quantity,
        unitType: p.unitType,
        total: p.total,
        editingTotal: p.total,
        delete: () => {
          console.log('delete product ' + p.id + ' from order ' + order.id);
          this.orderService.removeProduct(order.id, p.id).subscribe(o => {
            this.addTotal = 0;
            this.createModels(o);
          })
        },
        updateQuantity: (quantity: number) => {
          console.log('update product ' + p.id + ' quantity to ' + quantity + ' on order ' + order.id);
          this.orderService.updateProduct(order.id, p.id, {quantity}).subscribe(o => {
            this.addTotal = 0;
            this.createModels(o);
          })
        }
      })),
      addItem: (id: number, quantity: number) => {
        console.log('add product ' + id + '(' + quantity + ') to order ' + order.id);
        this.orderService.addProduct(order.id, id, {quantity}).subscribe(o => {
          this.addTotal = 0;
          this.createModels(o);
        })
      }
    }

    this.boxesModel = {
      itemsAvailable: Arrays
        .exceptByOther(
          this.model.boxes, b => b.id, 
          order.boxes, b => b.id)
        .map(b => ({
          id: b.id,
          name: b.name,
          price: b.price,
          unitType: 'each'
        })),
      items: order.boxes.map(b => ({
        id: b.id,
        name: b.name,
        price: b.total / b.quantity,
        quantity: b.quantity,
        unitType: 'each',
        total: b.total,
        editingTotal: b.total,
        delete: () => {
          console.log('delete box ' + b.id + ' from order ' + order.id);
          this.orderService.removeBox(order.id, b.id).subscribe(o => {
            this.addTotal = 0;
            this.createModels(o);
          })
        },
        updateQuantity: (quantity: number) => {
          console.log('update box ' + b.id + ' quantity to ' + quantity + ' on order ' + order.id);
          this.orderService.updateBox(order.id, b.id, {quantity}).subscribe(o => {
            this.addTotal = 0;
            this.createModels(o);
          })
        }
      })),
      addItem: (id: number, quantity: number) => {
        console.log('add box ' + id + '(' + quantity + ') to order ' + order.id);
        this.orderService.addBox(order.id, id, {quantity}).subscribe(o => {
          this.addTotal = 0;
          this.createModels(o);
        })
      }
    }
  }
}

export class CustomerOrderSectionModel {
  itemsAvailable: CustomerOrderAvailableItem[]
  items: CustomerOrderItemModel[]
  addItem: (id: number, quantity: number) => void;
}

export interface CustomerOrderAvailableItem {
  id: number;
  price: number;
  name: string;
  unitType: string;
}

export class CustomerOrderItemModel {
  id: number;
  name: string;
  price: number;
  quantity: number;
  unitType: string;
  total: number;
  editingTotal: number;

  delete: () => void;
  updateQuantity: (quantity: number) => void;
}