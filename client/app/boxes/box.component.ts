import { Component, Input, Output, EventEmitter, ViewChild, forwardRef, Inject, ElementRef, Renderer } from '@angular/core';
import { Box, BoxWithProducts, BoxProduct } from './box';
import { Product } from '../products/product'
import { WeightPipe, MoneyPipe } from '../shared/pipes';
import { HeadingComponent } from '../shared/heading.component';
import { BoxPriceComponent } from './box-price.component';
import { BoxProductsComponent } from './box-products.component';
import { ActiveElementDirective, ActivateOnFocusDirective, DeactivateOnBlurDirective } from '../shared/active-elements'

export interface BoxProductEvent {
  boxId: number;
  product: BoxProduct;
}

@Component({
  selector: 'cc-box',
  templateUrl: 'app/boxes/box.component.html',
  directives: [HeadingComponent, BoxPriceComponent, BoxProductsComponent, ActiveElementDirective, ActivateOnFocusDirective, DeactivateOnBlurDirective]
})
export class BoxComponent {
  constructor(private renderer: Renderer) {
  }

  @ViewChild('boxName')
  boxName: HeadingComponent;

  @Input()
  box: BoxWithProducts;

  @Input()
  tabindex: number;

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

  onProductAdd(product: BoxProduct) {
    this.productAdd.emit({boxId: this.box.id, product});
  }

  onProductUpdate(product: BoxProduct) {
    this.productUpdate.emit({boxId: this.box.id, product});
  }

  onProductRemove(product: BoxProduct) {
    this.productRemove.emit({boxId: this.box.id, product});
  }
}