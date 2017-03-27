import { Component, Input, Output, EventEmitter, ViewChild, forwardRef, Inject, ElementRef, OnInit, Renderer, ViewChildren, QueryList } from '@angular/core';
import { ActiveElementDirective, ActivateOnFocusDirective, DeactivateOnBlurDirective } from '../../shared/active-elements'
import { DistributeWidthDirective, DistributeWidthSumDirective } from '../distribute-width.directive'
import { OrderItemQuantityComponent } from './order-item-quantity.component'
import { EditableValueComponent } from '../../shared/editable-value.component'
import { Arrays } from '../../shared/arrays'
import { NumericDirective } from '../../shared/numeric.directive'
import { MoneyPipe } from '../../shared/pipes'
import { OrderModel, OrderAvailableItem } from './order.model'
import { OrderSectionModel } from './order-section.model'
import { OrderItemModel } from './order-item.model'

@Component({
  selector: 'cc-order-section',
  templateUrl: 'app/customers/orders/order-section.component.html',
  directives: [ActiveElementDirective, ActivateOnFocusDirective, DeactivateOnBlurDirective, DistributeWidthDirective, OrderItemQuantityComponent, DistributeWidthSumDirective, EditableValueComponent, NumericDirective],
  pipes: [MoneyPipe]
})
export class OrderSectionComponent implements OnInit {
  orderItemPadding = 10;
  quantity: number = 1;
  itemNameArticle: string;

  @Input()
  model: OrderSectionModel

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

  onOrderItemRemove(item: OrderItemModel, keyboard: boolean) {
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

  getItemId(item: OrderItemModel) {
    return item.id;
  }
}