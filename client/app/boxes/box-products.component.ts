import { Component, Directive, Input, ViewChild, ElementRef, Output, EventEmitter, ViewChildren, QueryList, AfterViewInit, ChangeDetectorRef, AfterViewChecked, OnChanges } from '@angular/core';
import { FocusDirective } from '../shared/focus.directive'
import { BoxProduct } from './box'
import { Subscription } from 'rxjs/Subscription'
import { Observable } from 'rxjs/Observable';
import { EditableComponent } from '../shared/editable.component'
import { Arrays } from '../shared/arrays'
import { WeightPipe } from '../shared/pipes'

const PRODUCT_NAME_PADDING: number = 10;
const PRODUCT_QUANTITY_PADDING: number = 27;
const COLUMN_WIDTH_REMAINDER: number = 53;
const MIN_ITEMS_IN_FIRST_COLUMN: number = 3;

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
  unusedProducts: BoxProduct[] = [];
  productNamePadding: number = PRODUCT_NAME_PADDING;
  productQuantityPadding: number = PRODUCT_QUANTITY_PADDING;
  maxColumns: number = 0;
  columnPadding: number;
  addingProduct: BoxProduct;

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

  columns: BoxProduct[][] = [];

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

    let columnWidth = this.productNameWidth + PRODUCT_NAME_PADDING
                    + this.productQuantityWidth + PRODUCT_QUANTITY_PADDING
                    + COLUMN_WIDTH_REMAINDER;
    
    if(this.columnPadding != columnWidth) {
      console.log('columnWidth: ' + columnWidth);
      this.columnPadding = columnWidth; //Math.floor(columnWidth * 1.2);
      detectChanges = true;
    }

    let width = this.root.nativeElement.getBoundingClientRect().width;
    let noOfColumns = Math.floor(width / columnWidth);
    while((columnWidth * noOfColumns) + this.columnPadding * (noOfColumns - 1) > width) {
      noOfColumns --;
    }

    if(noOfColumns != this.maxColumns) {
      console.log('noOfColumns: ' + noOfColumns);
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

  startAdd() {
    this.addingProduct = this.unusedProducts[0].clone();
  }

  endAdd() {
    this.addingProduct = null;
  }

  addProduct(event: any) {
    this.addingProduct = this.unusedProducts[+event.srcElement.value].clone();
  }
}