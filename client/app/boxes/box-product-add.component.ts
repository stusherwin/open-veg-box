import { Component, Directive, Input, ViewChild, ElementRef, Output, EventEmitter, ViewChildren, QueryList, AfterViewInit, ChangeDetectorRef, AfterViewChecked, OnChanges, Inject, forwardRef, OnInit, OnDestroy, Renderer } from '@angular/core';
import { BoxProduct } from './box'
import { Product } from '../products/product'
import { Subscription } from 'rxjs/Subscription'
import { Observable } from 'rxjs/Observable';
import { BoxProductsService } from './box-products.service'
import { ActiveDirective, ActiveParentDirective, ActivateOnFocusDirective } from '../shared/active-elements';

@Component({
  selector: 'cc-box-product-add',
  templateUrl: 'app/boxes/box-product-add.component.html',
  directives: [ActiveDirective, ActiveParentDirective, ActivateOnFocusDirective]
})
export class BoxProductAddComponent implements AfterViewInit {
  adding: boolean;
  product: Product;
  quantityStringValue: string;
  
  @Input()
  products: Product[];

  @Input()
  editId: string;

  @Input()
  productNameWidth: number;

  @Input()
  productQuantityWidth: number;

  @Input()
  editTabindex: number;

  @Input()
  text: string;

  @ViewChildren('select')
  select: QueryList<ElementRef>

  @ViewChild('add')
  addBtn: ElementRef  

  @Output()
  add = new EventEmitter<BoxProduct>();

  constructor(
    private service: BoxProductsService,
    private renderer: Renderer,
    private changeDetector: ChangeDetectorRef) {
  }

  ngAfterViewInit() {
    if(this.service.isActive(this.editId) && this.products.length) {
      this.focus();
      // focus changes addHover state, so need to force change detection
      this.changeDetector.detectChanges();
    }
  }

  onAddClick() {
    this.product = this.products[0];
    this.quantityStringValue = '1';
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
    if(this.tabbedAway && this.products.length > 1) {
      setTimeout(() => this.renderer.invokeElementMethod(this.addBtn.nativeElement, 'focus', []))
    }

    let quantity = this.toDecimalValue(this.quantityStringValue);
    this.add.emit(new BoxProduct(this.product.id, this.product.name, quantity, this.product.unitType));

    this.adding = false;
    this.tabbedAway = false;
  }

  onAddCancelClick() {
    this.adding = false;
    this.tabbedAway = false;
  }

  onActivate() {
    this.service.setActive(this.editId);
  }

  onDeactivate() {
    if(this.adding) {
      if(this.tabbedAway) {
        this.onAddOkClick();
      } else {
        this.onAddCancelClick();
      }
    }
  }

  focus() {
    this.renderer.invokeElementMethod(this.addBtn.nativeElement, 'focus', []);
  }
 
  tabbedAway = false;
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
      } else if(event.key == 'Tab' && !event.shiftKey) {
        this.tabbedAway = true;
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