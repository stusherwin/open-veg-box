import { Component, Input } from '@angular/core';
import { WeightPipe } from '../shared/pipes'

@Component({
  selector: 'cc-product-quantity',
  pipes: [WeightPipe],
  templateUrl: 'app/products/product-quantity.component.html'
})
export class ProductQuantityComponent {
  @Input()
  quantity: number;

  @Input()
  unitType: string;
}