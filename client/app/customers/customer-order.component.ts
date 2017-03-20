import { Component, Input, Output, EventEmitter, ViewChild, forwardRef, Inject, ElementRef, OnInit, Renderer, ViewChildren, QueryList } from '@angular/core';
import { ActiveElementDirective } from '../shared/active-elements'
import { DistributeWidthDirective, DistributeWidthSumDirective } from './distribute-width.directive'
import { CustomerOrderModel, CustomerOrderItemModel } from './customers-home.component'
import { CustomerOrderSectionComponent } from './customer-order-section.component'
import { MoneyPipe } from '../shared/pipes'
import { Product } from '../products/product'
import { Box } from '../boxes/box'

@Component({
  selector: 'cc-customer-order',
  templateUrl: 'app/customers/customer-order.component.html',
  directives: [ActiveElementDirective, DistributeWidthDirective, DistributeWidthSumDirective, CustomerOrderSectionComponent],
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

  ngOnInit() {
    this.productsModel = {
      itemsAvailable: this.model.extraProductsAvailable,
      items: this.model.extraProducts,
      addItem: this.model.addProduct
    }

    this.boxesModel = {
      itemsAvailable: this.model.boxesAvailable.map(b => ({
        id: b.id,
        name: b.name,
        price: b.price,
        unitType: 'each'
      })),
      items: this.model.boxes,
      addItem: this.model.addBox
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