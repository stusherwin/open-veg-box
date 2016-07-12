import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Product } from './product';
import { WeightPipe, MoneyPipe } from '../shared/pipes';

@Component({
  selector: 'cc-product-display',
  templateUrl: 'app/products/product-display.component.html',
  pipes: [WeightPipe, MoneyPipe]
})
export class ProductDisplayComponent {
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