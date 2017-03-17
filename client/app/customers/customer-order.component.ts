import { Component, Input, Output, EventEmitter, ViewChild, forwardRef, Inject, ElementRef, OnInit } from '@angular/core';
import { ActiveElementDirective, ActivateOnFocusDirective, DeactivateOnBlurDirective } from '../shared/active-elements'
import { DistributeWidthDirective, DistributeWidthSumDirective } from './distribute-width.directive'
import { BoxProductQuantityComponent } from './box-product-quantity.component'
import { CustomerOrderModel, CustomerOrderItemModel } from './customers-home.component'
import { Arrays } from '../shared/arrays'

@Component({
  selector: 'cc-customer-order',
  templateUrl: 'app/customers/customer-order.component.html',
  directives: [ActiveElementDirective, ActivateOnFocusDirective, DeactivateOnBlurDirective, DistributeWidthDirective, BoxProductQuantityComponent, DistributeWidthSumDirective],
})
export class CustomerOrderComponent {
  orderItemPadding = 10;

  @Input()
  model: CustomerOrderModel;

  @Input()
  index: number;

  onOrderItemRemove(item: CustomerOrderItemModel, keyboard: boolean) {
    item.delete();
    Arrays.remove(this.model.items, item);
  }

  onOrderItemAdd(keyboard: boolean) {
    this.model.addBox(1, 23);
  }
}