import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Product, UnitType, unitTypes } from './product';
import { WeightPipe, MoneyPipe } from '../shared/pipes';

@Component({
  selector: 'cc-product-display',
  templateUrl: 'app/products/product-display.component.html',
  pipes: [WeightPipe, MoneyPipe]
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

  edit() {
    this.onEdit.emit(this.product);
  } 
}