import { Component, Input, Output, EventEmitter, ViewChild, forwardRef, Inject, ElementRef, OnInit, Renderer, ViewChildren, QueryList } from '@angular/core';
import { ActiveElementDirective, ActivateOnFocusDirective, DeactivateOnBlurDirective } from '../shared/active-elements'
import { DistributeWidthDirective, DistributeWidthSumDirective } from './distribute-width.directive'
import { BoxProductQuantityComponent } from './box-product-quantity.component'
import { CustomerOrderModel, CustomerOrderItemModel } from './customers-home.component'
import { EditableValueComponent } from '../shared/editable-value.component'
import { Arrays } from '../shared/arrays'
import { NumericDirective } from '../shared/numeric.directive'

@Component({
  selector: 'cc-customer-order',
  templateUrl: 'app/customers/customer-order.component.html',
  directives: [ActiveElementDirective, ActivateOnFocusDirective, DeactivateOnBlurDirective, DistributeWidthDirective, BoxProductQuantityComponent, DistributeWidthSumDirective, EditableValueComponent, NumericDirective],
})
export class CustomerOrderComponent implements OnInit {
  orderItemPadding = 10;
  quantity: number = 1;
  potentialItems: PotentialItem[];
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
    this.potentialItems = this.model.boxes
      .filter(b => !this.model.items.find(i => i.type == 'box' && i.id == b.id))
      .map(b => ({
        type: 'box',
        id: b.id,
        name: b.name,
        unitType: 'each'
      }))
      .concat(
        this.model.products
          .filter(p => !this.model.items.find(i => i.type == 'product' && i.id == p.id))
          .map(p => ({
            type: 'product',
            id: p.id,
            name: p.name,
            unitType: p.unitType
          })));

    this.addingItem = {
      type: this.potentialItems[0].type,
      id: this.potentialItems[0].id,
      quantity: 1,
      unitType: this.potentialItems[0].unitType
    };
  }

  onOrderItemRemove(item: CustomerOrderItemModel, keyboard: boolean) {
    item.delete();
    Arrays.remove(this.model.items, item);
  }

  onOrderItemAdd(item: AddingItem) {
    if(item.type == 'box') {
      this.model.addBox(item.id, item.quantity);
    } else {
      this.model.addProduct(item.id, item.quantity);
    }
  }

  onAddStart() {
    this.renderer.invokeElementMethod(this.select.nativeElement, 'focus', []);
  }

  onPotentialItemChange(event: any) {
    let potentialItem = this.potentialItems[+event.target.value];
    
    this.addingItem.type = potentialItem.type;
    this.addingItem.id = potentialItem.id;
    this.addingItem.unitType = potentialItem.unitType;
  }

  onAddOk() {
    if(this.addingItem.type == 'box') {
      this.model.addBox(this.addingItem.id, this.addingItem.quantity);
    } else {
      this.model.addProduct(this.addingItem.id, this.addingItem.quantity);
    }
    this.editable.endEdit();
  }

  onAddCancel() {
    let potentialItem = this.potentialItems[0];
    
    this.addingItem.type = potentialItem.type;
    this.addingItem.id = potentialItem.id;
    this.addingItem.quantity = 1;
    this.addingItem.unitType = potentialItem.unitType;
    this.editable.endEdit();
  }
}

class PotentialItem {
  type: string;
  id: number;
  name: string;
  unitType: string;
}

class AddingItem {
  type: string;
  id: number;
  quantity: number;
  unitType: string;
}