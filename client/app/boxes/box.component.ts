import { Component, Input, Output, EventEmitter, ViewChild, forwardRef, Inject, ElementRef, Renderer } from '@angular/core';
import { Box, BoxWithProducts } from './box';
import { Product, ProductQuantity } from '../products/product'
import { WeightPipe, MoneyPipe } from '../shared/pipes';
import { BoxProductsComponent } from './box-products-new.component';
import { EditableHeadingComponent } from '../shared/editable-heading.component'
import { EditablePriceComponent } from '../shared/editable-price.component'
import { Validators } from '@angular/common'
import { ButtonComponent } from '../shared/button.component'

export interface BoxProductEvent {
  boxId: number;
  product: ProductQuantity;
}

@Component({
  selector: 'cc-box',
  templateUrl: 'app/boxes/box.component.html',
  directives: [BoxProductsComponent, EditableHeadingComponent, EditablePriceComponent, ButtonComponent]
})
export class BoxComponent {
  boxNameValidators = [Validators.required];
  boxPriceValidators = [Validators.required];

  constructor(private renderer: Renderer) {
  }

  @Input()
  box: BoxWithProducts;

  @Input()
  products: Product[];

  @Output()
  delete = new EventEmitter<Box>();

  @Output()
  update = new EventEmitter<Box>();

  @Output()
  productAdd = new EventEmitter<BoxProductEvent>();

  @Output()
  productUpdate = new EventEmitter<BoxProductEvent>();

  @Output()
  productRemove = new EventEmitter<BoxProductEvent>();

  onDelete() {
    this.delete.emit(this.box);
  }

  onUpdate() {
    this.update.emit(this.box);
  }

  onProductAdd(product: ProductQuantity) {
    this.productAdd.emit({boxId: this.box.id, product});
  }

  onProductUpdate(product: ProductQuantity) {
    this.productUpdate.emit({boxId: this.box.id, product});
  }

  onProductRemove(product: ProductQuantity) {
    this.productRemove.emit({boxId: this.box.id, product});
  }
}