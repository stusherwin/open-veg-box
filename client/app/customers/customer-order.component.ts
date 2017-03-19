import { Component, Input, Output, EventEmitter, ViewChild, forwardRef, Inject, ElementRef, OnInit, Renderer, ViewChildren, QueryList } from '@angular/core';
import { ActiveElementDirective } from '../shared/active-elements'
import { DistributeWidthDirective, DistributeWidthSumDirective } from './distribute-width.directive'
import { CustomerOrderModel } from './customers-home.component'
import { CustomerOrderBoxesComponent } from './customer-order-boxes.component'
import { CustomerOrderProductsComponent } from './customer-order-products.component'

@Component({
  selector: 'cc-customer-order',
  templateUrl: 'app/customers/customer-order.component.html',
  directives: [ActiveElementDirective, DistributeWidthDirective, DistributeWidthSumDirective, CustomerOrderBoxesComponent, CustomerOrderProductsComponent],
})
export class CustomerOrderComponent {
  @Input()
  model: CustomerOrderModel;

  @Input()
  tabindex: number;
}