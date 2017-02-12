import { Component, Directive, Input, ViewChild, ElementRef, Output, EventEmitter, ViewChildren, QueryList, AfterViewInit, ChangeDetectorRef, AfterViewChecked, OnChanges, Inject, forwardRef, OnInit, OnDestroy, Renderer } from '@angular/core';
import { BoxProduct } from './box'
import { Product } from '../products/product'
import { Subscription } from 'rxjs/Subscription'
import { Observable } from 'rxjs/Observable';
import { BoxProductsService } from './box-products.service'
import { ActiveElementDirective, ActivateOnFocusDirective } from '../shared/active-elements';
import { ValidatableComponent } from '../shared/validatable.component';

@Component({
  selector: 'cc-box-product-add',
  templateUrl: 'app/boxes/box-product-add.component.html',
  directives: [ActiveElementDirective, ActivateOnFocusDirective, ValidatableComponent]
})
export class BoxProductAddComponent implements OnInit, AfterViewInit {
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

  @ViewChild('active')
  active: ActiveElementDirective  

  @Output()
  add = new EventEmitter<BoxProduct>();

  get valid() {
    return this.toDecimalValue(this.quantityStringValue) > 0;
  }

  constructor(
    private service: BoxProductsService,
    private renderer: Renderer,
    private changeDetector: ChangeDetectorRef) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    if(this.service.isActive(this.editId) && this.products.length) {
      this.focus();
      // focus changes addHover state, so need to force change detection
      this.changeDetector.detectChanges();
    }
  }

  onClick() {
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

  onProductChange(event: any) {
    this.product = this.products[+event.target.value];
  }

  onOkClick() {
    if(!this.valid) {
      return;
    }

    if(this.tabbedAway && this.products.length > 1) {
      setTimeout(() => this.renderer.invokeElementMethod(this.addBtn.nativeElement, 'focus', []))
    }

    let quantity = this.toDecimalValue(this.quantityStringValue);
    this.add.emit(new BoxProduct(this.product.id, this.product.name, quantity, this.product.unitType));

    this.adding = false;
    this.tabbedAway = false;
    this.active.makeInactive();
  }

  onCancelClick() {
    this.adding = false;
    this.tabbedAway = false;
    this.active.makeInactive();    
  }

  onActivate() {
    this.service.setActive(this.editId);
  }

  onDeactivate() {
    if(this.adding) {
      if(this.tabbedAway && this.valid) {
        this.onOkClick();
      } else {
        this.onCancelClick();
      }
    }
  }

  focus() {
    this.renderer.invokeElementMethod(this.addBtn.nativeElement, 'focus', []);
  }
 
  tabbedAway = false;
  onKeydown(event: KeyboardEvent) {
    if(!this.adding) {
      if(event.key == 'Enter') {
        this.onClick();
      }
    } else {
      if(event.key == 'Enter' && this.valid) {
        this.onOkClick();
      } else if(event.key == 'Escape') {
        this.onCancelClick();
      } else if(event.key == 'Tab') {
        this.tabbedAway = !event.shiftKey;
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