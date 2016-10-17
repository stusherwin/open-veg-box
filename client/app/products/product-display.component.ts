import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Product, UnitType, unitTypes } from './product';
import { WeightPipe, MoneyPipe } from '../shared/pipes';
import { HeadingComponent } from '../shared/heading.component';
import { ProductPriceComponent } from './product-price.component';
import { ProductUnitQuantityComponent } from './product-unit-quantity.component';

@Component({
  selector: 'cc-product-display',
  templateUrl: 'app/products/product-display.component.html',
  pipes: [WeightPipe, MoneyPipe],
  directives: [HeadingComponent, ProductPriceComponent, ProductUnitQuantityComponent]
})
export class ProductDisplayComponent {
  unitTypes: {[key: string]: string } = {};

  constructor() {
    for( var ut of unitTypes) {
      this.unitTypes[ut.value] = ut.name;
    }
  }

  @Input()
  product: Product;

  @Input()
  editDisabled: boolean;

  @Output()
  onEdit = new EventEmitter<Product>();

  @Output()
  onDelete = new EventEmitter<Product>();

  edit() {
    this.onEdit.emit(this.product);
  }

  delete() {
    this.onDelete.emit(this.product);
  } 
}