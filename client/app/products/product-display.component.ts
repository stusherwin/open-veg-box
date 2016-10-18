import { Component, Input, Output, EventEmitter, AfterViewInit, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Product, UnitType, unitTypes } from './product';
import { WeightPipe, MoneyPipe } from '../shared/pipes';
import { HeadingComponent } from '../shared/heading.component';
import { ProductPriceComponent } from './product-price.component';
import { ProductUnitQuantityComponent } from './product-unit-quantity.component';

@Component({
  selector: 'cc-product-display',
  templateUrl: 'app/products/product-display.component.html',
  pipes: [WeightPipe, MoneyPipe],
  directives: [HeadingComponent, ProductPriceComponent, ProductUnitQuantityComponent]
})
export class ProductDisplayComponent implements AfterViewInit, OnInit {
  unitTypes: {[key: string]: string } = {};
  addPreview: boolean;

  constructor() {
    for( var ut of unitTypes) {
      this.unitTypes[ut.value] = ut.name;
    }
    this.product = new Product(0, 'New product', 1.0, "each", 1);
  }

  ngAfterViewInit() {
    // if(this.product.justAdded){
    //   console.log('justadded');
    //   this.productName.startEdit();
    // }
  }

  ngOnInit() {
    // if(this.product.justAdded){
    //   console.log('justadded');
    //   this.productName.startEdit();
    // }
  }

  @ViewChild('productName')
  productName: HeadingComponent;

  @Input()
  addMode: boolean;

  @Input()
  product: Product;

  @Input()
  editDisabled: boolean;

  @Output()
  onDelete = new EventEmitter<Product>();

  @Output()
  onSave = new EventEmitter<Product>();

  // startAdd() {
  //   this.adding = true;
  //   this.product = new Product(0, 'New product', 1.0, "each", 1);
  //   this.productName.startEdit();
  // }

  startAddPreview() {
    // console.log('over');
    this.addPreview = true;
  }

  endAddPreview() {
    // console.log('out');
    
    this.addPreview = false;
  }

  add() {
    this.onSave.emit(this.product);
    this.addPreview = false;    
  }

  delete() {
    this.onDelete.emit(this.product);
  }

  // cancel() {
  //   this.adding = false;
  // } 

  // save() {
  //   this.onSave.emit(this.product);
  // }
}