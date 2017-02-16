import { Component, Directive, Input, ViewChild, ElementRef, Output, EventEmitter, ViewChildren, QueryList, AfterViewInit, ChangeDetectorRef, AfterViewChecked, OnChanges, Inject, forwardRef, OnInit, OnDestroy, Renderer } from '@angular/core';
import { BoxProduct } from './box'
import { Product } from '../products/product'
import { Subscription } from 'rxjs/Subscription'
import { Observable } from 'rxjs/Observable';
import { BoxProductsService } from './box-products.service'
import { ActiveElementDirective, ActivateOnFocusDirective, DeactivateOnBlurDirective } from '../shared/active-elements';
import { ValidatableComponent } from '../shared/validatable.component';
import { EditableValueComponent } from '../shared/editable-value.component'

@Component({
  selector: 'cc-box-product-add',
  templateUrl: 'app/boxes/box-product-add.component.html',
  directives: [ActiveElementDirective, ActivateOnFocusDirective, DeactivateOnBlurDirective, ValidatableComponent, EditableValueComponent]
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

  @ViewChild('editable')
  editable: EditableValueComponent  

  @Output()
  add = new EventEmitter<BoxProduct>();

  constructor(
    private service: BoxProductsService,
    private renderer: Renderer,
    private changeDetector: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.product = this.products[0];
    this.quantityStringValue = '1';
  }

  ngAfterViewInit() {
    if(this.service.isActive(this.editId) && this.products.length) {
      this.focus();
      // focus changes addHover state, so need to force change detection
      this.changeDetector.detectChanges();
    }
  }

  onStart() {
    this.adding = true;
    this.service.setActive(this.editId);
    let subscription = this.select.changes.subscribe((f: QueryList<ElementRef>) => {
      if(f.length) {
        this.renderer.invokeElementMethod(f.first.nativeElement, 'focus', []);
        subscription.unsubscribe();
      }
    })
  }

  onProductChange(event: any) {
    this.product = this.products[+event.target.value];
  }

  onAdd() {
    this.editable.startEdit();
  }

  onOk(tabbedAway: boolean) {
    if(tabbedAway && this.products.length > 1) {
      setTimeout(() => this.renderer.invokeElementMethod(this.addBtn.nativeElement, 'focus', []))
    } else {
      this.service.setInactive(this.editId);
    }

    let quantity = this.toDecimalValue(this.quantityStringValue);
    this.add.emit(new BoxProduct(this.product.id, this.product.name, quantity, this.product.unitType));

    this.product = this.products[0];
    this.quantityStringValue = '1';
    this.editable.endEdit();
    this.adding = false;
  }

  onCancel() {
    this.product = this.products[0];
    this.quantityStringValue = '1';
    this.editable.endEdit();
    this.adding = false;
    this.service.setActive(this.editId);
  }

  focus() {
    this.renderer.invokeElementMethod(this.addBtn.nativeElement, 'focus', []);
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