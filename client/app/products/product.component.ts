import { Component, Input, Output, EventEmitter, ViewChild, forwardRef, Inject, ElementRef, Renderer } from '@angular/core';
import { Product, UnitType, unitTypes } from './product';
import { WeightPipe, MoneyPipe } from '../shared/pipes';
import { Validators } from '@angular/common'
import { EditableHeadingComponent } from '../shared/editable-heading.component'
import { EditableUnitPriceComponent } from '../shared/editable-unit-price.component'
import { ButtonComponent } from '../shared/button.component'

@Component({
  selector: 'cc-product',
  templateUrl: 'app/products/product.component.html',
  pipes: [WeightPipe, MoneyPipe],
  directives: [EditableHeadingComponent, EditableUnitPriceComponent, ButtonComponent]
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