import { Component, Input, Output, EventEmitter, ViewChild, forwardRef, Inject, ElementRef, Renderer } from '@angular/core';
import { Box, BoxProduct } from './box';
import { Product } from '../products/product'
import { WeightPipe, MoneyPipe } from '../shared/pipes';
import { HeadingComponent } from '../shared/heading.component';
import { BoxPriceComponent } from './box-price.component';
import { BoxProductsComponent } from './box-products.component';
import { ActiveElementDirective, ActivateOnFocusDirective } from '../shared/active-elements'

export interface BoxProductEvent {
  boxId: number;
  product: BoxProduct;
}

@Component({
  selector: 'cc-box',
  templateUrl: 'app/boxes/box.component.html',
  directives: [HeadingComponent, BoxPriceComponent, BoxProductsComponent, ActiveElementDirective, ActivateOnFocusDirective]
})
export class BoxComponent {
  adding: boolean;
  rowFocused: boolean;

  constructor(private renderer: Renderer) {
    this.box = new Box(0, 'New box', 10.0, []);
  }

  @ViewChild('boxName')
  boxName: HeadingComponent;

  @ViewChild('addButton')
  addButton: ElementRef;

  @Input()
  addMode: boolean;

  @Input()
  box: Box;

  @Input()
  index: number;

  @Input()
  showAddMessage: boolean;

  @Input()
  loaded: boolean;

  @Input()
  products: Product[];

  @Output()
  delete = new EventEmitter<Box>();

  @Output()
  add = new EventEmitter<Box>();

  @Output()
  update = new EventEmitter<Box>();

  @Output()
  productAdd = new EventEmitter<BoxProductEvent>();

  @Output()
  productUpdate = new EventEmitter<BoxProductEvent>();

  @Output()
  productRemove = new EventEmitter<BoxProductEvent>();

  startAdd() {
    this.adding = true;
    this.boxName.startEdit();
  }

  completeAdd() {
    this.add.emit(this.box);
    this.adding = false;
    this.box = new Box(0, 'New box', 10.0, []);

    this.startAdd();
  }

  onDelete() {
    this.delete.emit(this.box);
  }

  cancelAdd() {
    this.adding = false;
    this.box = new Box(0, 'New box', 10.0, []);

    this.renderer.invokeElementMethod(this.addButton.nativeElement, 'focus', []);
  }

  onUpdate() {
    if(!this.addMode) {
      this.update.emit(this.box);
    }
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

  onActivate() {
    var focusedChanged = !this.rowFocused;
    this.rowFocused = true;
    if(this.addMode && focusedChanged) {
      this.startAdd();
    }
  }

  onDeactivate() {
    if(this.adding) {
      this.adding = false;
      this.box = new Box(0, 'New box', 10.0, []);
    }
    this.rowFocused = false;
  }
}