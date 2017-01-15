import { Component, Input, Output, EventEmitter, ViewChild, forwardRef, Inject } from '@angular/core';
import { Box, BoxProduct } from './box';
import { WeightPipe, MoneyPipe } from '../shared/pipes';
import { HeadingComponent } from '../shared/heading.component';
import { FocusDirective } from '../shared/focus.directive'
import { BoxPriceComponent } from './box-price.component';
import { BoxProductsComponent } from './box-products.component';

@Component({
  selector: 'cc-box',
  templateUrl: 'app/boxes/box.component.html',
  directives: [HeadingComponent, FocusDirective, BoxPriceComponent, BoxProductsComponent]
})
export class BoxComponent {
  adding: boolean;
  rowFocused: boolean;

  constructor() {
    this.box = new Box(0, 'New box', 10.0, []);
  }

  @ViewChild('boxName')
  boxName: HeadingComponent;

  @ViewChild('addButton')
  addButton: FocusDirective;

  @Input()
  addMode: boolean;

  @Input()
  box: Box;

  @Input()
  index: number;

  @Input()
  showAddMessage: boolean;

  @Input()
  loaded: boolean;

  @Input()
  products: BoxProduct[];

  @Output()
  delete = new EventEmitter<Box>();

  @Output()
  add = new EventEmitter<Box>();

  @Output()
  update = new EventEmitter<Box>();

  @Output()
  productAdd = new EventEmitter<any>();

  @Output()
  productRemove = new EventEmitter<any>();

  startAdd() {
    this.adding = true;
    this.boxName.startEdit();
  }

  completeAdd() {
    this.add.emit(this.box);
    this.adding = false;
    this.box = new Box(0, 'New box', 10.0, []);

    this.startAdd();
  }

  onDelete() {
    this.delete.emit(this.box);
  }

  cancelAdd() {
    this.adding = false;
    this.box = new Box(0, 'New box', 10.0, []);

    this.addButton.beFocused();
  }

  onUpdate() {
    if(!this.addMode) {
      this.update.emit(this.box);
    }
  }

  onProductAdd(event: any) {
    this.productAdd.emit({boxId: this.box.id, productId: event.productId, quantity: event.quantity});
  }

  onProductRemove(productId: number) {
    this.productRemove.emit({boxId: this.box.id, productId: productId});
  }

  onRowFocus() {
    var focusedChanged = !this.rowFocused;
    this.rowFocused = true;
    if(this.addMode && focusedChanged) {
      this.startAdd();
    }
  }

  onRowBlur() {
    if(this.adding) {
      this.adding = false;
      this.box = new Box(0, 'New box', 10.0, []);
    }
    this.rowFocused = false;
  }
}