import { Component, Input, Output, EventEmitter, ViewChild, forwardRef, Inject, ElementRef, Renderer } from '@angular/core';
import { Product, UnitType, unitTypes } from './product';
import { WeightPipe, MoneyPipe } from '../shared/pipes';
import { HeadingComponent } from '../shared/heading.component';
import { ProductPriceComponent } from './product-price.component';
import { ActiveElementDirective, ActivateOnFocusDirective, DeactivateOnBlurDirective } from '../shared/active-elements'

@Component({
  selector: 'cc-product',
  templateUrl: 'app/products/product.component.html',
  pipes: [WeightPipe, MoneyPipe],
  directives: [HeadingComponent, ProductPriceComponent, ActiveElementDirective, ActivateOnFocusDirective, DeactivateOnBlurDirective]
})
export class ProductComponent {
  unitTypes: {[key: string]: string } = {};

  @ViewChild('productName')
  productName: HeadingComponent;

  @Input()
  product: Product;

  @Input()
  tabindex: number;

  @ViewChild('active')
  active: ActiveElementDirective;

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
    this.active.makeInactive();
  }

  onUpdate() {
    this.update.emit(this.product);
  }
}