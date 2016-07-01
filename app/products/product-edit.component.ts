import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Product } from './product';
import { CurrencyComponent } from '../controls/currency.component';

@Component({
  selector: 'cc-product-edit',
  templateUrl: 'app/products/product-edit.component.html',
  directives: [CurrencyComponent]
})
export class ProductEditComponent {
  @Input()
  product: Product;

  @ViewChild('f')
  f: ElementRef;

  @Output()
  onSave = new EventEmitter<Product>();

  @Output()
  onCancel = new EventEmitter();

  cancel() {
    console.log('cancel');
    this.onCancel.emit({});
  }

  log(x: any) {
    console.log(x);
  }

  save() {
    console.log('save()');
    this.onSave.emit(this.product);
  }

  parsePrice(text: string) {
    return parseFloat(text);
  }
}