import { Component, Directive, Input, ViewChild, ElementRef, Output, EventEmitter, ViewChildren, QueryList, AfterViewInit, ChangeDetectorRef, AfterViewChecked, OnChanges } from '@angular/core';
import { FocusDirective } from '../shared/focus.directive'
import { BoxProduct } from './box'
import { Subscription } from 'rxjs/Subscription'
import { Observable } from 'rxjs/Observable';
import { EditableComponent } from '../shared/editable.component'
import { Arrays } from '../shared/arrays'
import { WeightPipe } from '../shared/pipes'

const PRODUCT_NAME_PADDING = 1;
const PRODUCT_QUANTITY_PADDING = 5;
const ACTIONS_WIDTH = 32;
const MIN_ITEMS_IN_FIRST_COLUMN = 3;

@Component({
  selector: 'cc-box-products',
  directives: [FocusDirective, EditableComponent],
  pipes: [WeightPipe],
  templateUrl: 'app/boxes/box-products.component.html',
  host: {
    '(window:resize)': 'windowResized($event)',
  }
})
export class BoxProductsComponent implements AfterViewChecked {
  productNamePadding = PRODUCT_NAME_PADDING;
  productQuantityPadding = PRODUCT_QUANTITY_PADDING;
  columnWidth: number;
  columnPadding: number;
  columns: BoxProduct[][] = [];
  maxColumns: number = 0;
  unusedProducts: BoxProduct[] = [];
  addingProduct: BoxProduct;
  editingProduct: BoxProduct;
  
  @Input()
  value: BoxProduct[];

  @Input()
  products: BoxProduct[];

  @Input()
  productNameWidth: number;

  @Input()
  productQuantityWidth: number;

  @ViewChild('root')
  root: ElementRef

  @Output()
  add = new EventEmitter<BoxProduct>();

  @Output()
  remove = new EventEmitter<BoxProduct>();

  @Output()
  update = new EventEmitter<BoxProduct>(); 

  constructor(private changeDetector: ChangeDetectorRef) {
  }

  ngAfterViewChecked() {
    // TODO: move this out of AfterViewChecked?
    // Here because AfterViewChecked is the earliest event where correct element widths are available
    this.recalculateColumns();
    this.recalculateUnusedProducts();
  }

  recalculateUnusedProducts() {
    this.unusedProducts = this.products.filter(p => !this.value.find(v => v.id == p.id));
    this.unusedProducts.sort((a,b) => a.name < b.name? -1 : 1);
  }

  recalculateColumns() {
    if(!this.value || !this.value.length || !this.root) {
      return;
    }

    let detectChanges = false;

    let columnWidth = this.productNameWidth + this.productNamePadding
                    + this.productQuantityWidth + this.productQuantityPadding
                    + ACTIONS_WIDTH;
    
    if(this.columnWidth != columnWidth) {
      this.columnWidth = columnWidth;
      this.columnPadding = Math.floor(this.columnWidth * 0.8);
      detectChanges = true;
    }

    let width = this.root.nativeElement.getBoundingClientRect().width;
    let noOfColumns = Math.floor(width / columnWidth);
    while((columnWidth * noOfColumns) + this.columnWidth * (noOfColumns - 1) > width) {
      noOfColumns --;
    }

    if(noOfColumns != this.maxColumns) {
      this.maxColumns = noOfColumns;
      
      let columns: BoxProduct[][] = [];

      // Distribute evenly across columns
      // for(let i = 0; i < this.value.length; i++) {
      //   columns[i % noOfColumns].push(this.value[i]);
      // }

      // Fill up first columns
      let totalItems = this.value.length + 1; // include 'add product' row
      let maxInCol = Math.max(MIN_ITEMS_IN_FIRST_COLUMN, Math.ceil(totalItems / noOfColumns));
      
      for(let i = 0; i < totalItems; i++) {
        let col = Math.floor(i / maxInCol);
        if(!columns[col]) {
          columns[col] = [];
        }
        if(this.value[i]) {
          columns[col].push(this.value[i]);
        }
      }

      this.columns = columns;
      detectChanges = true;
    }

    if(detectChanges) {
      this.changeDetector.detectChanges();
    }
  }

  windowResized(event: any) {
    this.recalculateColumns();
  }

  onAddClick() {
    this.addingProduct = this.unusedProducts[0].clone();
  }

  onAddProductChange(event: any) {
    this.addingProduct = this.unusedProducts[+event.target.value].clone();
  }

  onAddOkClick() {
    this.add.emit(this.addingProduct);
    this.addingProduct = null;
  }

  onAddCancelClick() {
    this.addingProduct = null;
  }

  onEditClick(product: BoxProduct) {
    this.editingProduct = product.clone();
  }

  onEditOkClick() {
    this.update.emit(this.editingProduct);
    this.editingProduct = null;
  }

  onEditCancelClick() {
    this.editingProduct = null;
  }

  onRemoveClick(product: BoxProduct) {
    this.remove.emit(product);
  }

  onEditQuantityChange(value: any) {
    this.editingProduct.quantity = this.toDecimalValue(value);
  }

  onAddQuantityChange(value: any) {
    this.addingProduct.quantity = this.toDecimalValue(value);
  }

  fixedDecimals: number = null;
  maxDecimals: number = 3;
  private toDecimalValue(value: string): number {
    var parsed = parseFloat(value);
    if( isNaN(parsed) ) {
      return 0;
    }

    if(this.fixedDecimals) {
      return parseFloat(parsed.toFixed(this.fixedDecimals));
    }

    if (this.maxDecimals) {
      return parseFloat(parsed.toFixed(this.maxDecimals));
    }

    return parsed;
  }
}