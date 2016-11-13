import { Component, Input, Output, EventEmitter, ViewChild, forwardRef, Inject } from '@angular/core';
import { Product, UnitType, unitTypes } from './product';
import { WeightPipe, MoneyPipe } from '../shared/pipes';
import { HeadingComponent } from '../shared/heading.component';
import { ProductPriceComponent } from './product-price.component';
import { ProductUnitQuantityComponent } from './product-unit-quantity.component';
import { FocusDirective } from '../shared/focus.directive'
import { HighlightableDirective } from '../shared/highlightable.directive'
import { ProductsComponent } from './products.component';

@Component({
  selector: 'cc-product-display',
  templateUrl: 'app/products/product-display.component.html',
  pipes: [WeightPipe, MoneyPipe],
  directives: [HeadingComponent, ProductPriceComponent, ProductUnitQuantityComponent, FocusDirective, HighlightableDirective]
})
export class ProductDisplayComponent {
  unitTypes: {[key: string]: string } = {};
  adding: boolean;
  focusedChild: any;
  focused: boolean;

  constructor() {
    for( var ut of unitTypes) {
      this.unitTypes[ut.value] = ut.name;
    }

    this.product = new Product(0, 'New product', 1.0, "each", 1);
  }

  @ViewChild('productName')
  productName: HeadingComponent;

  @ViewChild('addButton')
  addButton: FocusDirective;

  @ViewChild('row')
  row: HighlightableDirective;

  @Input()
  addMode: boolean;

  @Input()
  product: Product;

  @Input()
  editDisabled: boolean;

  @Input()
  index: number;

  @Input()
  showAddMessage: boolean;

  @Output()
  delete = new EventEmitter<Product>();

  @Output()
  add = new EventEmitter<Product>();

  @Output()
  update = new EventEmitter<Product>();

  startAdd() {
    this.adding = true;
    this.productName.startEdit();
  }

  completeAdd() {
    this.add.emit(this.product);
    this.adding = false;
    this.product = new Product(0, 'New product', 1.0, "each", 1);

    this.startAdd();
  }

  onDelete() {
    this.delete.emit(this.product);
  }

  cancelAdd() {
    this.adding = false;
    this.product = new Product(0, 'New product', 1.0, "each", 1);

    this.addButton.focus();
  }

  focus(evnt: any) {
    if(!this.focused) {
      if(this.addMode) {
        this.startAdd();
      }
    }
    
    this.focusedChild = evnt.srcElement;
    this.focused = true;
  } 

  blur(evnt: any) {
    if(this.focusedChild && this.focusedChild == evnt.srcElement){
      this.focusedChild = null;
    }

    setTimeout(() => {
      if(!this.focusedChild) {
        if(this.adding) {
          this.adding = false;
          this.product = new Product(0, 'New product', 1.0, "each", 1);
        }
        this.focused = false;
      }
    }, 100);
  }

  onUpdate() {
    if(!this.addMode) {
      this.update.emit(this.product);
    }
  }
}