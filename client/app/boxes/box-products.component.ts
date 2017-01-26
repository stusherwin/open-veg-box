import { Component, Directive, Input, ViewChild, ElementRef, Output, EventEmitter, ViewChildren, QueryList, AfterViewInit, ChangeDetectorRef, AfterViewChecked, OnChanges, Inject, forwardRef, OnInit, OnDestroy } from '@angular/core';
import { FocusDirective } from '../shared/focus.directive'
import { BoxProduct } from './box'
import { Subscription } from 'rxjs/Subscription'
import { Observable } from 'rxjs/Observable';
import { EditableComponent } from '../shared/editable.component'
import { Arrays } from '../shared/arrays'
import { WeightPipe } from '../shared/pipes'
import { BoxProductsService } from './box-products.service'
import { BoxProductQuantityComponent } from './box-product-quantity.component' 
import { MutuallyExclusiveEditService, MutuallyExclusiveEditComponent } from './mutually-exclusive-edit.service'

const PRODUCT_NAME_PADDING = 1;
const PRODUCT_QUANTITY_PADDING = 5;
const ACTIONS_WIDTH = 17;
const MIN_ITEMS_IN_FIRST_COLUMN = 3;
const COLUMN_PADDING_RATIO = 0.8;

@Component({
  selector: 'cc-box-products',
  directives: [FocusDirective, EditableComponent, BoxProductQuantityComponent],
  pipes: [WeightPipe],
  templateUrl: 'app/boxes/box-products.component.html',
  host: {
    '(window:resize)': 'windowResized($event)',
  }
})
export class BoxProductsComponent implements OnInit, AfterViewChecked, MutuallyExclusiveEditComponent {
  productNamePadding = PRODUCT_NAME_PADDING;
  productQuantityPadding = PRODUCT_QUANTITY_PADDING;
  actionsWidth = ACTIONS_WIDTH;
  productNameWidth: number;
  productQuantityWidth: number;
  productNameMaxWidth: number;
  productQuantityMaxWidth: number;
  columnWidth: number;
  columnPadding: number;
  columns: BoxProduct[][] = [];
  maxColumns: number = 0;
  unusedProducts: BoxProduct[] = [];
  addingProduct: BoxProduct;
  editingProductId: number;
  removeHoverProductId: number;
  
  @Input()
  value: BoxProduct[];

  @Input()
  products: BoxProduct[];

  @Input()
  editId: string;

  @ViewChild('root')
  root: ElementRef

  @ViewChildren('productNameTest')
  productNameTests: QueryList<ElementRef>

  @ViewChildren('productQuantityTest')
  productQuantityTests: QueryList<ElementRef>

  @ViewChild('focusable')
  focusable: FocusDirective

  @Output()
  add = new EventEmitter<BoxProduct>();

  @Output()
  remove = new EventEmitter<BoxProduct>();

  @Output()
  update = new EventEmitter<BoxProduct>(); 

  constructor(
    @Inject(forwardRef(() => BoxProductsService))
    private service: BoxProductsService,
    
    @Inject(forwardRef(() => MutuallyExclusiveEditService))
    private mutexService: MutuallyExclusiveEditService,

    private changeDetector: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.recalculateUnusedProducts();
  }

  ngOnDestroy() {
    this.service.deregister(this);
  }

  ngAfterViewChecked() {
    // TODO: move this out of AfterViewChecked?
    // Here because AfterViewChecked is the earliest event where correct element widths are available
    this.recalculateWidths();
  }

  editing(editId: string) {
    return this.mutexService.isAnyEditingWithPrefix(editId);
  }

  anyEditing() {
    return this.mutexService.isAnyEditingWithPrefix(this.editId);
  }

  recalculateWidths() {
    let newNameMaxWidth = Math.floor(Math.max(...this.productNameTests.map(e => e.nativeElement.getBoundingClientRect().width)));
    let newQuantityMaxWidth = Math.floor(Math.max(...this.productQuantityTests.map(e => e.nativeElement.getBoundingClientRect().width)));

    if(newNameMaxWidth != this.productNameMaxWidth || newQuantityMaxWidth != this.productQuantityMaxWidth) {
      this.productNameMaxWidth = newNameMaxWidth;
      this.productQuantityMaxWidth = newQuantityMaxWidth;

      this.service.newMaxWidths(this, newNameMaxWidth, newQuantityMaxWidth);
    }
  }

  recalculateUnusedProducts() {
    this.unusedProducts = this.products.filter(p => !this.value.find(v => v.id == p.id));
    this.unusedProducts.sort((a,b) => a.name < b.name? -1 : 1);
  }

  recalculateColumnWidths(productNameWidth: number, productQuantityWidth: number) {
    if(!this.value || !this.root) {
      return;
    }

    this.productNameWidth = productNameWidth;
    this.productQuantityWidth = productQuantityWidth;

    this.columnWidth = this.productNameWidth + this.productNamePadding
                     + this.productQuantityWidth + this.productQuantityPadding
                     + ACTIONS_WIDTH;
    
    this.columnPadding = Math.floor(this.columnWidth * COLUMN_PADDING_RATIO);

    let width = this.root.nativeElement.getBoundingClientRect().width;
    let noOfColumns = Math.floor(width / this.columnWidth);
    while((this.columnWidth * noOfColumns) + this.columnWidth * (noOfColumns - 1) > width) {
      noOfColumns --;
    }

    if(noOfColumns != this.maxColumns) {
      this.maxColumns = noOfColumns;
      this.repopulateColumns();
    }

    this.changeDetector.detectChanges();
  }

  repopulateColumns() {
    let columns: BoxProduct[][] = [];

    // Distribute evenly across columns
    // for(let i = 0; i < this.value.length; i++) {
    //   columns[i % noOfColumns].push(this.value[i]);
    // }

    // Fill up first columns
    let totalItems = this.value.length + 1; // include 'add product' row
    let maxInCol = Math.max(MIN_ITEMS_IN_FIRST_COLUMN, Math.ceil(totalItems / this.maxColumns));
    
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
  }

  windowResized(event: any) {
    this.recalculateColumnWidths(this.productNameWidth, this.productQuantityWidth);
  }

  onAddClick() {
    this.mutexService.startEdit(this);
    this.addingProduct = this.unusedProducts[0].clone();
  }

  onAddProductChange(event: any) {
    this.addingProduct = this.unusedProducts[+event.target.value].clone();
  }

  onAddOkClick() {
    this.add.emit(this.addingProduct);
    this.value.push(this.addingProduct);
    
    this.recalculateUnusedProducts();
    this.repopulateColumns();

    this.addingProduct = null;
  }

  onAddCancelClick() {
    this.addingProduct = null;
  }

  endEdit() {
    this.addingProduct = null;
  }

  onProductQuantityEditStart(productId: number) {
    this.addingProduct = null;
  }

  onProductQuantityUpdate(productId: number, quantity: number) {
    let i = this.value.findIndex(p => p.id == productId);
    this.value[i].quantity = quantity;
    this.update.emit(this.value[i]);

    this.repopulateColumns();
  }

  onProductQuantityEditEnd(productId: number) {
  }

  onRemoveClick(product: BoxProduct) {
    this.remove.emit(product);
    Arrays.remove(this.value, product);
    
    this.recalculateUnusedProducts();
    this.repopulateColumns();
  }

  onAddQuantityChange(value: any) {
    this.addingProduct.quantity = this.toDecimalValue(value);
  }

  onRootFocus() {
  }

  onRootBlur() {
    this.addingProduct = null;
  }

  keydown(event: KeyboardEvent) {
    if(!this.addingProduct) {
      return;
    }

    if(event.key == 'Enter') {
      this.onAddOkClick();
    } else if(event.key == 'Escape') {
      this.onAddCancelClick();
    }
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