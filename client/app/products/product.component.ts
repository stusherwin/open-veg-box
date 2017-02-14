import { Component, Input, Output, EventEmitter, ViewChild, forwardRef, Inject, ElementRef, Renderer } from '@angular/core';
import { Product, UnitType, unitTypes } from './product';
import { WeightPipe, MoneyPipe } from '../shared/pipes';
import { HeadingComponent } from '../shared/heading.component';
import { ProductPriceComponent } from './product-price.component';
import { ProductUnitQuantityComponent } from './product-unit-quantity.component';
import { ActiveElementDirective, ActivateOnFocusDirective, DeactivateOnBlurDirective } from '../shared/active-elements'

@Component({
  selector: 'cc-product',
  templateUrl: 'app/products/product.component.html',
  pipes: [WeightPipe, MoneyPipe],
  directives: [HeadingComponent, ProductPriceComponent, ProductUnitQuantityComponent, ActiveElementDirective, ActivateOnFocusDirective, DeactivateOnBlurDirective]
})
export class ProductComponent {
  unitTypes: {[key: string]: string } = {};
  adding: boolean;
  rowFocused: boolean;

  @ViewChild('productName')
  productName: HeadingComponent;

  @ViewChild('add')
  addButton: ElementRef;

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

  @ViewChild('active')
  active: ActiveElementDirective;

  @Output()
  delete = new EventEmitter<Product>();

  @Output()
  add = new EventEmitter<Product>();

  @Output()
  update = new EventEmitter<Product>();

  constructor(private renderer: Renderer) {
    for( var ut of unitTypes) {
      this.unitTypes[ut.value] = ut.name;
    }

    this.product = new Product(0, 'New product', 1.0, "each", 1);
  }

  startAdd() {
    this.adding = true;
    this.productName.startEdit();
  }

  completeAdd() {
    this.add.emit(this.product);
    this.adding = false;
    this.product = new Product(0, 'New product', 1.0, "each", 1);
    this.active.makeInactive();
  }

  onDelete() {
    this.delete.emit(this.product);
    this.active.makeInactive();
  }

  cancelAdd() {
    this.adding = false;
    this.product = new Product(0, 'New product', 1.0, "each", 1);
    this.active.makeInactive();
  }

  onUpdate() {
    if(!this.addMode) {
      this.update.emit(this.product);
    }
  }

  onActivate() {
    this.rowFocused = true;
  }

  onDeactivate() {
    if(this.adding) {
      this.adding = false;
      this.product = new Product(0, 'New product', 1.0, "each", 1);
    }
    this.rowFocused = false;
  }
}