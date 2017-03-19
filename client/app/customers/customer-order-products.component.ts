import { Component, Input, Output, EventEmitter, ViewChild, forwardRef, Inject, ElementRef, OnInit, Renderer, ViewChildren, QueryList } from '@angular/core';
import { ActiveElementDirective, ActivateOnFocusDirective, DeactivateOnBlurDirective } from '../shared/active-elements'
import { DistributeWidthDirective, DistributeWidthSumDirective } from './distribute-width.directive'
import { BoxProductQuantityComponent } from './box-product-quantity.component'
import { CustomerOrderModel, CustomerOrderItemModel } from './customers-home.component'
import { EditableValueComponent } from '../shared/editable-value.component'
import { Arrays } from '../shared/arrays'
import { NumericDirective } from '../shared/numeric.directive'
import { Product } from '../products/product'
import { MoneyPipe } from '../shared/pipes'

@Component({
  selector: 'cc-customer-order-products',
  templateUrl: 'app/customers/customer-order-products.component.html',
  directives: [ActiveElementDirective, ActivateOnFocusDirective, DeactivateOnBlurDirective, DistributeWidthDirective, BoxProductQuantityComponent, DistributeWidthSumDirective, EditableValueComponent, NumericDirective],
  pipes: [MoneyPipe]
})
export class CustomerOrderProductsComponent implements OnInit {
  orderItemPadding = 10;
  quantity: number = 1;
  addingItem: AddingItem;

  @Input()
  model: CustomerOrderModel;

  @Input()
  tabindex: number;

  @ViewChild('select')
  select: ElementRef;

  @ViewChild('editable')
  editable: EditableValueComponent

  constructor(private renderer: Renderer) {
  }

  ngOnInit() {
    let product = this.model.extraProductsAvailable[0];

    this.addingItem = {
      id: product.id,
      quantity: 1,
      unitType: product.unitType
    };
  }

  onOrderItemRemove(item: CustomerOrderItemModel, keyboard: boolean) {
    item.delete();
    Arrays.remove(this.model.extraProducts, item);
  }

  onAddStart() {
    this.renderer.invokeElementMethod(this.select.nativeElement, 'focus', []);
  }

  onProductChange(productId: number) {
    let product = this.model.extraProductsAvailable.find(p => p.id == productId);
    
    this.addingItem.id = product.id;
    this.addingItem.unitType = product.unitType;
  }

  onAddOk() {
    this.model.addProduct(this.addingItem.id, this.addingItem.quantity);
    this.editable.endEdit();

    let product = this.model.extraProductsAvailable[0];
    this.addingItem.id = product.id;
    this.addingItem.quantity = 1;
    this.addingItem.unitType = product.unitType;
  }

  onAddCancel() {
    this.editable.endEdit();

    let product = this.model.extraProductsAvailable[0];
    this.addingItem.id = product.id;
    this.addingItem.quantity = 1;
    this.addingItem.unitType = product.unitType;
  }
}

class AddingItem {
  id: number;
  quantity: number;
  unitType: string;
}