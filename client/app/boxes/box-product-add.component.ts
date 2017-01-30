import { Component, Directive, Input, ViewChild, ElementRef, Output, EventEmitter, ViewChildren, QueryList, AfterViewInit, ChangeDetectorRef, AfterViewChecked, OnChanges, Inject, forwardRef, OnInit, OnDestroy, Renderer } from '@angular/core';
import { BoxProduct } from './box'
import { Product } from '../products/product'
import { Subscription } from 'rxjs/Subscription'
import { Observable } from 'rxjs/Observable';
import { BoxProductsService } from './box-products.service'
import { MutuallyExclusiveEditService, MutuallyExclusiveEditComponent } from './mutually-exclusive-edit.service'

@Component({
  selector: 'cc-box-product-add',
  templateUrl: 'app/boxes/box-product-add.component.html'
})
export class BoxProductAddComponent implements OnInit, AfterViewInit, MutuallyExclusiveEditComponent {
  adding: boolean;
  addHover: boolean;
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

  @ViewChildren('select')
  select: QueryList<ElementRef>

  @ViewChild('add')
  addBtn: ElementRef  

  @Output()
  add = new EventEmitter<BoxProduct>();

  constructor(
    @Inject(forwardRef(() => MutuallyExclusiveEditService))
    private mutexService: MutuallyExclusiveEditService,
    private renderer: Renderer) {
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
    if(this.select.length && this.adding) {
      this.renderer.invokeElementMethod(this.select.first.nativeElement, 'focus', []);
    }
  }

  onAddClick() {
    this.mutexService.startEdit(this);
    this.product = this.products[0];
    this.quantityStringValue = '';
    this.adding = true;

    let subscription = this.select.changes.subscribe((f: QueryList<ElementRef>) => {
      if(f.length && this.adding) {
        this.renderer.invokeElementMethod(f.first.nativeElement, 'focus', []);
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
    if(this.adding) {
      this.onAddOkClick();
    }
  }

  onAddFocus() {
    this.addHover = true
    this.mutexService.startEdit(this);
  }

  onAddBlur() {
    this.addHover = false
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