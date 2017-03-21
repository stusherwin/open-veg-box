import { Component, Input, Output, EventEmitter, ViewChild, forwardRef, Inject, ElementRef, OnInit, Renderer, ViewChildren, QueryList } from '@angular/core';
import { ActiveElementDirective, ActivateOnFocusDirective, DeactivateOnBlurDirective } from '../shared/active-elements'
import { DistributeWidthDirective, DistributeWidthSumDirective } from './distribute-width.directive'
import { BoxProductQuantityComponent } from './box-product-quantity.component'
import { EditableValueComponent } from '../shared/editable-value.component'
import { Arrays } from '../shared/arrays'
import { NumericDirective } from '../shared/numeric.directive'
import { MoneyPipe } from '../shared/pipes'
import { CustomerOrderSectionModel, CustomerOrderAvailableItem } from './customer-order.component'
import { CustomerOrderItemModel } from './customer-order.component'

@Component({
  selector: 'cc-customer-order-section',
  templateUrl: 'app/customers/customer-order-section.component.html',
  directives: [ActiveElementDirective, ActivateOnFocusDirective, DeactivateOnBlurDirective, DistributeWidthDirective, BoxProductQuantityComponent, DistributeWidthSumDirective, EditableValueComponent, NumericDirective],
  pipes: [MoneyPipe]
})
export class CustomerOrderSectionComponent implements OnInit {
  orderItemPadding = 10;
  quantity: number = 1;
  addingItem: AddingItem;
  itemNameArticle: string;

  @Input()
  model: CustomerOrderSectionModel;

  @Input()
  tabindex: number;

  @Input()
  heading: string;

  @Input()
  itemName: string;

  @ViewChild('select')
  select: ElementRef;

  @ViewChild('editable')
  editable: EditableValueComponent

  @Output()
  addTotalChange = new EventEmitter<number>()

  constructor(private renderer: Renderer) {
  }

  ngOnInit() {
    this.itemNameArticle = /^[aeiou]/i.test(this.itemName) ? 'an' : 'a';
    let item = this.model.itemsAvailable[0];

    this.addingItem = {
      id: item? item.id : 0,
      price: item? item.price : 0,
      quantity: 1,
      unitType: item? item.unitType : 'each'
    };
  }

  onOrderItemRemove(item: CustomerOrderItemModel, keyboard: boolean) {
    item.delete();
    Arrays.remove(this.model.items, item);
  }

  onAddStart() {
    this.renderer.invokeElementMethod(this.select.nativeElement, 'focus', []);
    this.addTotalChange.emit(this.addingItem.price * this.addingItem.quantity);
  }

  onItemChange(itemId: number) {
    let item = this.model.itemsAvailable.find(p => p.id == itemId);
    
    this.addingItem.id = item.id;
    this.addingItem.price = item.price;
    this.addingItem.unitType = item.unitType;
    this.addTotalChange.emit(this.addingItem.price * this.addingItem.quantity);    
  }

  onAddOk() {
    this.model.addItem(this.addingItem.id, this.addingItem.quantity);
    this.editable.endEdit();

    let item = this.model.itemsAvailable[0];
    this.addingItem.id = item.id;
    this.addingItem.price = item.price;
    this.addingItem.quantity = 1;
    this.addingItem.unitType = item.unitType;
    this.addTotalChange.emit(0);
  }

  onAddCancel() {
    this.editable.endEdit();

    let item = this.model.itemsAvailable[0];
    this.addingItem.id = item.id;
    this.addingItem.price = item.price;
    this.addingItem.quantity = 1;
    this.addingItem.unitType = item.unitType;
    this.addTotalChange.emit(0);
  }

  onAddingItemQuantityChange(quantity: number) {
    if(this.editable.editing) {
      this.addTotalChange.emit(this.addingItem.price * quantity);
    }
  }

  onItemQuantityChange(item: CustomerOrderItemModel, quantity: number) {
    if(quantity == null) {
      item.editingTotal = item.total;
      this.addTotalChange.emit(0);
      return;
    }

    item.editingTotal = item.price * quantity;
    this.addTotalChange.emit(item.editingTotal - item.total);
  }
}

class AddingItem {
  id: number;
  price: number;
  quantity: number;
  unitType: string;
}