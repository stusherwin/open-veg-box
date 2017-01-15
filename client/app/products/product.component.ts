import { Component, Input, Output, EventEmitter, ViewChild, forwardRef, Inject } from '@angular/core';
import { Product, UnitType, unitTypes } from './product';
import { WeightPipe, MoneyPipe } from '../shared/pipes';
import { HeadingComponent } from '../shared/heading.component';
import { ProductPriceComponent } from './product-price.component';
import { ProductUnitQuantityComponent } from './product-unit-quantity.component';
import { FocusDirective } from '../shared/focus.directive'

@Component({
  selector: 'cc-product',
  templateUrl: 'app/products/product.component.html',
  pipes: [WeightPipe, MoneyPipe],
  directives: [HeadingComponent, ProductPriceComponent, ProductUnitQuantityComponent, FocusDirective]
})
export class ProductComponent {
  unitTypes: {[key: string]: string } = {};
  adding: boolean;
  rowFocused: boolean;

  constructor() {
    for( var ut of unitTypes) {
      this.unitTypes[ut.value] = ut.name;
    }

    this.product = new Product(0, 'New product', 1.0, "each", 1);
  }

  @ViewChild('productName')
  productName: HeadingComponent;

  @ViewChild('addButton')
  addButton: FocusDirective;

  @Input()
  addMode: boolean;

  @Input()
  product: Product;

  @Input()
  index: number;

  @Input()
  showAddMessage: boolean;

  @Input()
  loaded: boolean;

  @Output()
  delete = new EventEmitter<Product>();

  @Output()
  add = new EventEmitter<Product>();

  @Output()
  update = new EventEmitter<Product>();

  startAdd() {
    this.adding = true;
    this.productName.startEdit();
  }

  completeAdd() {
    this.add.emit(this.product);
    this.adding = false;
    this.product = new Product(0, 'New product', 1.0, "each", 1);

    this.startAdd();
  }

  onDelete() {
    this.delete.emit(this.product);
  }

  cancelAdd() {
    this.adding = false;
    this.product = new Product(0, 'New product', 1.0, "each", 1);

    this.addButton.beFocused();
  }

  onUpdate() {
    if(!this.addMode) {
      this.update.emit(this.product);
    }
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
      this.product = new Product(0, 'New product', 1.0, "each", 1);
    }
    this.rowFocused = false;
  }
}