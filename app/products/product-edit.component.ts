import { Component, Input, Output, EventEmitter, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Product, UnitType } from './product';
import { NumberComponent } from '../shared/number.component';

@Component({
  selector: 'cc-product-edit',
  templateUrl: 'app/products/product-edit.component.html',
  directives: [NumberComponent]
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

  unitTypes: UnitType[];

  constructor() {
    this.unitTypes = Object.values(UnitType.All);
  }

  ngAfterViewInit() {
    this.name.nativeElement.focus();
  }

  cancel() {
    this.onCancel.emit({});
  }

  save() {
    this.onSave.emit(this.product);
  }
}