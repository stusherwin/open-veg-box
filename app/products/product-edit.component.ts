import { Component, Input, Output, EventEmitter, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Product } from './product';
import { CurrencyComponent } from '../controls/currency.component';

@Component({
  selector: 'cc-product-edit',
  templateUrl: 'app/products/product-edit.component.html',
  directives: [CurrencyComponent]
})
export class ProductEditComponent implements AfterViewInit {
  @Input()
  product: Product;

  @Output()
  onSave = new EventEmitter<Product>();

  @Output()
  onCancel = new EventEmitter();

  @ViewChild('name')
  name: ElementRef; 

  ngAfterViewInit() {
    this.name.nativeElement.focus();
    console.log(this.name.nativeElement);
  }

  cancel() {
    this.onCancel.emit({});
  }

  save() {
    this.onSave.emit(this.product);
  }
}