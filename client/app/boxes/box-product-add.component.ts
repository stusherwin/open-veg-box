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

@Component({
  selector: 'cc-box-product-add',
  directives: [FocusDirective, EditableComponent, BoxProductQuantityComponent],
  pipes: [WeightPipe],
  templateUrl: 'app/boxes/box-product-add.component.html'
})
export class BoxProductAddComponent implements MutuallyExclusiveEditComponent {
  addingProduct: BoxProduct;
  
  @Input()
  products: BoxProduct[];

  @Input()
  editId: string;

  @Input()
  noProducts: boolean;

  @Input()
  productNameWidth: number;

  @Input()
  productQuantityWidth: number;

  @Output()
  add = new EventEmitter<BoxProduct>();

  constructor(
    @Inject(forwardRef(() => MutuallyExclusiveEditService))
    private mutexService: MutuallyExclusiveEditService) {
  }

  onAddClick() {
    this.mutexService.startEdit(this);
    this.addingProduct = this.products[0].clone();
  }

  onAddProductChange(event: any) {
    this.addingProduct = this.products[+event.target.value].clone();
  }

  onAddOkClick() {
    this.add.emit(this.addingProduct);

    this.addingProduct = null;
    this.mutexService.endEdit(this);
  }

  onAddCancelClick() {
    this.addingProduct = null;
    this.mutexService.endEdit(this);
  }

  endEdit() {
    this.addingProduct = null;
  }

  onAddQuantityChange(value: any) {
    this.addingProduct.quantity = this.toDecimalValue(value);
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