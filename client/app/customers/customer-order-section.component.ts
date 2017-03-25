import { Component, Input, Output, EventEmitter, ViewChild, forwardRef, Inject, ElementRef, OnInit, Renderer, ViewChildren, QueryList } from '@angular/core';
import { ActiveElementDirective, ActivateOnFocusDirective, DeactivateOnBlurDirective } from '../shared/active-elements'
import { DistributeWidthDirective, DistributeWidthSumDirective } from './distribute-width.directive'
import { BoxProductQuantityComponent } from './box-product-quantity.component'
import { EditableValueComponent } from '../shared/editable-value.component'
import { Arrays } from '../shared/arrays'
import { NumericDirective } from '../shared/numeric.directive'
import { MoneyPipe } from '../shared/pipes'
import { CustomerOrderModel, CustomerOrderAvailableItem } from './customer-order.model'
import { CustomerOrderSectionModel } from './customer-order-section.model'
import { CustomerOrderItemModel } from './customer-order-item.model'

@Component({
  selector: 'cc-customer-order-section',
  templateUrl: 'app/customers/customer-order-section.component.html',
  directives: [ActiveElementDirective, ActivateOnFocusDirective, DeactivateOnBlurDirective, DistributeWidthDirective, BoxProductQuantityComponent, DistributeWidthSumDirective, EditableValueComponent, NumericDirective],
  pipes: [MoneyPipe]
})
export class CustomerOrderSectionComponent implements OnInit {
  orderItemPadding = 10;
  quantity: number = 1;
  itemNameArticle: string;

  @Input()
  model: CustomerOrderSectionModel

  @Input()
  tabindex: number;

  @Input()
  heading: string;

  @Input()
  itemName: string;

  @ViewChild('add')
  addBtn: ElementRef;

  @ViewChild('select')
  select: ElementRef;

  @ViewChild('editable')
  editable: EditableValueComponent

  @ViewChildren('remove')
  removeBtns: QueryList<ElementRef>

  constructor(private renderer: Renderer) {
  }

  ngOnInit() {
    this.itemNameArticle = /^[aeiou]/i.test(this.itemName) ? 'an' : 'a';
  }

  onOrderItemRemove(item: CustomerOrderItemModel, keyboard: boolean) {
    let index = this.model.items.findIndex(i => i == item);
    item.remove();
    if(keyboard) {
      if(this.model.items.length) {
        setTimeout(() => {
          let nextRemoveFocusIndex = Math.min(index, this.model.items.length - 1);
          let nextFocusBtn = this.removeBtns.toArray()[nextRemoveFocusIndex];
          this.renderer.invokeElementMethod(nextFocusBtn.nativeElement, 'focus', [])
        })
      } else if(this.model.itemsAvailable.length) {
        setTimeout(() => this.renderer.invokeElementMethod(this.addBtn.nativeElement, 'focus', []))
      }
    } else {
      if(this.model.items.length) {
        let nextRemoveFocusIndex = Math.min(index, this.model.items.length - 1);
        let nextFocusBtn = this.removeBtns.toArray()[nextRemoveFocusIndex];
        this.renderer.invokeElementMethod(nextFocusBtn.nativeElement, 'blur', [])
      }
    }
 }

  onAddStart() {
    this.renderer.invokeElementMethod(this.select.nativeElement, 'focus', []);
    this.model.startAdd();
  }

  onAddOk(tabbedAway: boolean) {
    if(tabbedAway && this.model.itemsAvailable.length > 1) {
      setTimeout(() => this.renderer.invokeElementMethod(this.addBtn.nativeElement, 'focus', []))
    }

    this.model.add();
    this.editable.endEdit();
  }

  onAddCancel() {
    this.model.cancelAdd();
    this.editable.endEdit();
  }

  onAddingItemQuantityChange(quantity: number) {
    this.model.recalculateTotal();
  }

  getItemId(item: CustomerOrderItemModel) {
    return item.id;
  }
}