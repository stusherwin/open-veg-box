import { Component, Directive, Input, ViewChild, ElementRef, Output, EventEmitter, ViewChildren, QueryList, AfterViewInit, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { FocusDirective } from '../shared/focus.directive'
import { BoxProduct } from './box'
import { Subscription } from 'rxjs/Subscription'
import { Observable } from 'rxjs/Observable';
import { EditableComponent } from '../shared/editable.component'
import { Arrays } from '../shared/arrays'
import { WeightPipe } from '../shared/pipes'

const PRODUCT_NAME_PADDING: number = 10;
const COLUMN_WIDTH_REMAINDER: number = 15;
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
  columnPadding: number;

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
    this.recalculateColumns();
  }

  recalculateColumns() {
    if(!this.value || !this.value.length) {
      return;
    }

    let columnWidth = this.productNameWidth + PRODUCT_NAME_PADDING + this.productQuantityWidth + COLUMN_WIDTH_REMAINDER;
    this.columnPadding = columnWidth; //Math.floor(columnWidth * 1.2);

    let width = this.root.nativeElement.getBoundingClientRect().width;
    let noOfColumns = Math.floor(width / columnWidth);
    while((columnWidth * noOfColumns) + this.columnPadding * (noOfColumns - 1) > width) {
      noOfColumns --;
    }

    if(noOfColumns != this.columns.length) {
      let columns: BoxProduct[][] = [];

      for(let i = 0; i < noOfColumns; i++) {
        columns[i] = [];
      }

      // Distribute evenly across columns
      // for(let i = 0; i < this.value.length; i++) {
      //   columns[i % noOfColumns].push(this.value[i]);
      // }

      // Fill up first columns
      let maxInCol = Math.max(MIN_ITEMS_IN_FIRST_COLUMN, Math.ceil(this.value.length / noOfColumns));
      for(let i = 0; i < this.value.length; i++) {
        columns[Math.floor(i / maxInCol)].push(this.value[i]);
      }

      this.columns = columns;
      this.changeDetector.detectChanges();
    }
  }

  windowResized(event: any) {
    this.recalculateColumns();
  }
}