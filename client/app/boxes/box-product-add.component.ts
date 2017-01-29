import { Component, Directive, Input, ViewChild, ElementRef, Output, EventEmitter, ViewChildren, QueryList, AfterViewInit, ChangeDetectorRef, AfterViewChecked, OnChanges, Inject, forwardRef, OnInit, OnDestroy } from '@angular/core';
import { FocusDirective } from '../shared/focus.directive'
import { BoxProduct } from './box'
import { Product } from '../products/product'
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
export class BoxProductAddComponent implements OnInit, AfterViewInit, MutuallyExclusiveEditComponent {
  adding: boolean;
  product: Product;
  quantityStringValue: string;
  
  @Input()
  products: Product[];

  @Input()
  editId: string;

  @Input()
  noProducts: boolean;

  @Input()
  productNameWidth: number;

  @Input()
  productQuantityWidth: number;

  @ViewChildren('focusable')
  focusables: QueryList<FocusDirective>

  @ViewChildren('foc')
  focs: QueryList<FocusDirective>

  @Output()
  add = new EventEmitter<BoxProduct>();

  constructor(
    @Inject(forwardRef(() => MutuallyExclusiveEditService))
    private mutexService: MutuallyExclusiveEditService) {
  }

  ngOnInit() {
    if(this.mutexService.isAnyEditingWithPrefix(this.editId)) {
      this.mutexService.startEdit(this);
      this.product = this.products[0];
      this.quantityStringValue = '';
      this.adding = true;
    }
  }

  ngAfterViewInit() {
    if(this.focusables.length && this.adding) {
      this.focusables.first.beFocused();
    }
  }

  onAddClick() {
    this.mutexService.startEdit(this);
    this.product = this.products[0];
    this.quantityStringValue = '';
    this.adding = true;

    let subscription = this.focusables.changes.subscribe((f: QueryList<FocusDirective>) => {
      if(f.length && this.adding) {
        f.first.beFocused();
        subscription.unsubscribe();
      }
    })
  }

  onAddProductChange(event: any) {
    this.product = this.products[+event.target.value];
  }

  onAddOkClick() {
    let quantity = this.toDecimalValue(this.quantityStringValue);
    if(quantity > 0) {
      this.add.emit(new BoxProduct(this.product.id, this.product.name, quantity, this.product.unitType));
    }

    this.adding = false;
    this.mutexService.endEdit(this);
  }

  onAddCancelClick() {
    this.adding = false;
    this.mutexService.endEdit(this);
  }

  endEdit() {
    this.onAddOkClick();
  }

  onAddFocus() {
    if(this.adding) {
      return;
    }

    this.onAddClick();
  }

  onHiddenAddFocus() {
    console.log('hiddenAddFocus');
    if(this.focs.length) {
      console.log('len');
      this.focs.first.beFocused();
    } else {
      let subscription = this.focs.changes.subscribe((f: QueryList<FocusDirective>) => {
        console.log('sub');
        
        if(f.length) {
          console.log('it\'s here')
          f.first.beFocused();
          subscription.unsubscribe();
        }
      })
    }
  }

  keydown(event: KeyboardEvent) {
    if(!this.adding) {
      if(event.key == 'Enter') {
        this.onAddClick();
      }
    } else {
      if(event.key == 'Enter') {
        this.onAddOkClick();
      } else if(event.key == 'Escape') {
        this.onAddCancelClick();
      }
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