import { Component, Input, Output, EventEmitter, AfterViewInit, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Product, UnitType, unitTypes } from './product';
import { WeightPipe, MoneyPipe } from '../shared/pipes';
import { HeadingComponent } from '../shared/heading.component';
import { ProductPriceComponent } from './product-price.component';
import { ProductUnitQuantityComponent } from './product-unit-quantity.component';
import { FocusDirective } from '../shared/focus.directive'

@Component({
  selector: 'cc-product-display',
  templateUrl: 'app/products/product-display.component.html',
  pipes: [WeightPipe, MoneyPipe],
  directives: [HeadingComponent, ProductPriceComponent, ProductUnitQuantityComponent, FocusDirective]
})
export class ProductDisplayComponent implements AfterViewInit, OnInit {
  unitTypes: {[key: string]: string } = {};
  addPreview: boolean;
  adding: boolean;

  constructor() {
    for( var ut of unitTypes) {
      this.unitTypes[ut.value] = ut.name;
    }

    this.product = new Product(0, 'New product', 1.0, "each", 1);
  }

  ngAfterViewInit() {
  }

  ngOnInit() {
  }

  @ViewChild('productName')
  productName: HeadingComponent;

  @ViewChild('addButton')
  addButton: FocusDirective;

  @Input()
  addMode: boolean;

  @Input()
  product: Product;

  @Input()
  editDisabled: boolean;

  @Input()
  index: number;

  @Output()
  onDelete = new EventEmitter<Product>();

  @Output()
  onSave = new EventEmitter<Product>();

  startAdd() {
    this.adding = true;
    this.addPreview = false;
    this.productName.startEdit();
  }

  startAddPreview() {
    if(this.adding) {
      return;
    }
    this.addPreview = true;
  }

  endAddPreview() {
    if(this.adding) {
      return;
    }
    this.addPreview = false;
  }

  completeAdd() {
    this.onSave.emit(this.product);
    this.adding = false;
    this.product = new Product(0, 'New product', 1.0, "each", 1);
    this.addButton.focus();
  }

  delete() {
    this.onDelete.emit(this.product);
  }

  cancelAdd() {
    this.adding = false;
    this.product = new Product(0, 'New product', 1.0, "each", 1);
    this.addButton.focus();
  } 
}