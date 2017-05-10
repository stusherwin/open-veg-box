import { Component, Input, Output, EventEmitter, ViewChild, forwardRef, Inject, ElementRef, Renderer } from '@angular/core';
import { Product, UnitType, unitTypes } from './product';
import { WeightPipe, MoneyPipe } from '../shared/pipes';
import { HeadingComponent } from '../shared/heading.component';
import { ProductPriceComponent } from './product-price.component';
import { Validators } from '@angular/common'
import { EditableHeadingComponent } from '../shared/editable-heading.component'
import { EditableUnitPriceComponent } from '../shared/editable-unit-price.component'

@Component({
  selector: 'cc-product',
  templateUrl: 'app/products/product.component.html',
  pipes: [WeightPipe, MoneyPipe],
  directives: [HeadingComponent, ProductPriceComponent, EditableHeadingComponent, EditableUnitPriceComponent]
})
export class ProductComponent {
  unitTypes: {[key: string]: string } = {};
  productNameValidators = [Validators.required];
  productUnitPriceValidators = [Validators.required];

  @Input()
  product: Product;

  @Output()
  delete = new EventEmitter<Product>();

  @Output()
  update = new EventEmitter<Product>();

  constructor(private renderer: Renderer) {
    for( var ut of unitTypes) {
      this.unitTypes[ut.value] = ut.name;
    }
  }

  onDelete() {
    this.delete.emit(this.product);
  }

  onUpdate() {
    this.update.emit(this.product);
  }
}