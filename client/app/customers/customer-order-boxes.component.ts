import { Component, Input, Output, EventEmitter, ViewChild, forwardRef, Inject, ElementRef, OnInit, Renderer, ViewChildren, QueryList } from '@angular/core';
import { ActiveElementDirective, ActivateOnFocusDirective, DeactivateOnBlurDirective } from '../shared/active-elements'
import { DistributeWidthDirective, DistributeWidthSumDirective } from './distribute-width.directive'
import { BoxProductQuantityComponent } from './box-product-quantity.component'
import { CustomerOrderModel, CustomerOrderItemModel } from './customers-home.component'
import { EditableValueComponent } from '../shared/editable-value.component'
import { Arrays } from '../shared/arrays'
import { NumericDirective } from '../shared/numeric.directive'
import { Box } from '../boxes/box'

@Component({
  selector: 'cc-customer-order-boxes',
  templateUrl: 'app/customers/customer-order-boxes.component.html',
  directives: [ActiveElementDirective, ActivateOnFocusDirective, DeactivateOnBlurDirective, DistributeWidthDirective, BoxProductQuantityComponent, DistributeWidthSumDirective, EditableValueComponent, NumericDirective],
})
export class CustomerOrderBoxesComponent implements OnInit {
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
    this.addingItem = {
      id: this.model.boxesAvailable[0].id,
      quantity: 1,
      unitType: 'each'
    };
  }

  onOrderItemRemove(item: CustomerOrderItemModel, keyboard: boolean) {
    item.delete();
    Arrays.remove(this.model.boxes, item);
  }

  onAddStart() {
    this.renderer.invokeElementMethod(this.select.nativeElement, 'focus', []);
  }

  onBoxChange(boxId: number) {
    let box = this.model.boxesAvailable.find(b => b.id == boxId);
    
    this.addingItem.id = box.id;
  }

  onAddOk() {
    this.model.addBox(this.addingItem.id, this.addingItem.quantity);
    this.editable.endEdit();
    
    let box = this.model.boxesAvailable[0];
    this.addingItem.id = box.id;
    this.addingItem.quantity = 1;
  }

  onAddCancel() {
    this.editable.endEdit();
    
    let box = this.model.boxesAvailable[0];
    this.addingItem.id = box.id;
    this.addingItem.quantity = 1;
  }
}

class AddingItem {
  id: number;
  quantity: number;
  unitType: string;
}