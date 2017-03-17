import { Component, Input, Output, EventEmitter, ViewChild, forwardRef, Inject, ElementRef, OnInit, Renderer, ViewChildren, QueryList } from '@angular/core';
import { ActiveElementDirective, ActivateOnFocusDirective, DeactivateOnBlurDirective } from '../shared/active-elements'
import { DistributeWidthDirective, DistributeWidthSumDirective } from './distribute-width.directive'
import { BoxProductQuantityComponent } from './box-product-quantity.component'
import { CustomerOrderModel, CustomerOrderItemModel } from './customers-home.component'
import { EditableValueComponent } from '../shared/editable-value-new.component'
import { Arrays } from '../shared/arrays'

@Component({
  selector: 'cc-customer-order',
  templateUrl: 'app/customers/customer-order.component.html',
  directives: [ActiveElementDirective, ActivateOnFocusDirective, DeactivateOnBlurDirective, DistributeWidthDirective, BoxProductQuantityComponent, DistributeWidthSumDirective, EditableValueComponent],
})
export class CustomerOrderComponent {
  orderItemPadding = 10;

  @Input()
  model: CustomerOrderModel;

  @Input()
  tabindex: number;

  // @ViewChildren('select')
  // select: QueryList<ElementRef>

  @ViewChild('select')
  select: ElementRef;

  constructor(private renderer: Renderer) {
  }

  onOrderItemRemove(item: CustomerOrderItemModel, keyboard: boolean) {
    item.delete();
    Arrays.remove(this.model.items, item);
  }

  onOrderItemAdd(keyboard: boolean) {
    this.model.addBox(1, 23);
  }

  onStartAdd() {
    // let subscription = this.select.changes.subscribe((f: QueryList<ElementRef>) => {
    //   if(f.length) {
    //     console.log('select present');
    //     this.renderer.invokeElementMethod(f.first.nativeElement, 'focus', []);
    //     subscription.unsubscribe();
    //   }
    // })
    this.renderer.invokeElementMethod(this.select.nativeElement, 'focus', []);
  }
}