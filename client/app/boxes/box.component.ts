import { Component, Input, Output, EventEmitter, ViewChild, forwardRef, Inject, ElementRef, Renderer } from '@angular/core';
import { Box, BoxWithProducts } from './box';
import { Product, ProductQuantity } from '../products/product'
import { WeightPipe, MoneyPipe } from '../shared/pipes';
import { HeadingComponent } from '../shared/heading.component';
import { BoxPriceComponent } from './box-price.component';
import { BoxProductsComponent } from './box-products.component';
import { ActiveElementDirective, ActivateOnFocusDirective, DeactivateOnBlurDirective } from '../shared/active-elements'
import { EditableHeadingComponent } from '../shared/editable-heading.component'
import { EditablePriceComponent } from '../shared/editable-price.component'
import { Validators } from '@angular/common'

export interface BoxProductEvent {
  boxId: number;
  product: ProductQuantity;
}

@Component({
  selector: 'cc-box',
  templateUrl: 'app/boxes/box.component.html',
  directives: [HeadingComponent, BoxPriceComponent, BoxProductsComponent, ActiveElementDirective, ActivateOnFocusDirective, DeactivateOnBlurDirective, EditableHeadingComponent, EditablePriceComponent]
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

  @ViewChild('active')
  active: ActiveElementDirective;

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
    this.active.makeInactive();
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