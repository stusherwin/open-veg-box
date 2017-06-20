import { Component, Input, Output, EventEmitter, ViewChild, forwardRef, Inject, ElementRef, OnInit, Renderer, ViewChildren, QueryList, Directive, HostListener, HostBinding, AfterViewInit, ContentChildren, ChangeDetectorRef } from '@angular/core';
import { Arrays } from '../shared/arrays'
import { MoneyPipe } from '../shared/pipes'
import { BoxProductsModel } from './box-products.model'
import { BoxProductModel } from './box-products.model'
import { ProductQuantityComponent } from '../products/product-quantity.component'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { Subject } from 'rxjs/Subject'
import { Observable } from 'rxjs/Observable'
import 'rxjs/add/operator/distinct'
import { Control, Validators, FORM_DIRECTIVES, FormBuilder, ControlGroup } from '@angular/common'
import { ValidationResult } from '../shared/input.component'
import { NumberComponent } from '../shared/number.component'
import { SelectComponent } from '../shared/select.component'
import { EditableEditButtonComponent } from '../shared/editable-edit-button.component'
import { EditableButtonsComponent } from '../shared/editable-buttons.component'
import { BoxProductComponent } from './box-product-new.component' 
import { EditableService } from '../shared/editable.service'
import { Product } from '../products/product'
import { BoxWithProducts } from '../boxes/box'
import { BoxService } from './box.service'
import { DistributeWidthMasterDirective } from '../shared/distribute-width.directive'


@Component({
  selector: 'cc-box-products',
  templateUrl: 'app/boxes/box-products-new.component.html',
  directives: [ProductQuantityComponent, EditableEditButtonComponent, EditableButtonsComponent, NumberComponent, SelectComponent, FORM_DIRECTIVES, BoxProductComponent, DistributeWidthMasterDirective],
  pipes: [MoneyPipe]
})
export class BoxProductsComponent implements OnInit {
  model: BoxProductsModel

  @Input()
  key: string

  @Input()
  box: BoxWithProducts

  @Input()
  products: Product[]

  @ViewChildren('select')
  select: QueryList<SelectComponent>;

  @ViewChildren('itemCmpt')
  itemCmpts: QueryList<BoxProductComponent>;

  @ViewChildren('addBtn')
  addBtn: QueryList<EditableEditButtonComponent>;

  quantity: Control;
  form: ControlGroup;
  submitted = false;
  quantityMessages = {
    required: 'Quantity is required.',
    notGreaterThanZero: 'Quantity must be greater than zero.',
    notNumeric: 'Quantity must be a number.',
    eachMustBeWholeNumber: 'Products sold \'per each\' must have a whole number quantity.'
  }
  quantityValidationMessage: string;

  constructor(private renderer: Renderer, private builder: FormBuilder, 
  @Inject(forwardRef(() => EditableService))
  private editableService: EditableService,
  private boxService: BoxService
  ) {
  }

  ngOnInit() {
    this.model = new BoxProductsModel(
      this.box,
      this.products,
      this.boxService)

    let validateQuantity: (c: Control) => ValidationResult = control => { 
      if (this.model.addingProduct && this.model.addingProduct.unitType == 'each' && ''+parseFloat(control.value) != ''+parseInt(control.value)) {
        return { "eachMustBeWholeNumber": true };
      }
  
      return null;
    };

    this.quantity = new Control('', Validators.compose([NumberComponent.isGreaterThanZero, validateQuantity]))
    this.form = this.builder.group({
      quantity: this.quantity
    })

    this.editableService.currentlyEditing.subscribe((key: any) => {
      if(!this.model.adding && key == this.key) {
        this.startAdd();
      } else if(this.model.adding && key != this.key) {
        this.cancelAdd();
      }
    })
  }

  getProductId(product: BoxProductModel) {
    return product.id;
  }

  startAdd(){
    this.submitted = false;
    this.editableService.startEdit(this.key);
    this.model.startAdd();
    let sub = this.select.changes.subscribe((l: QueryList<SelectComponent>) => {
      if(l.length) {
        l.first.focus();
        sub.unsubscribe();
      }
    });
  }

  completeAdd(keydown: boolean) {
    this.submitted = true;

    if(!this.quantity.valid) {
      this.setValidationMessage();
    } else {
      if(this.model.productsAvailable.length > 1) {
        let sub = this.addBtn.changes.subscribe((l: QueryList<EditableEditButtonComponent>) => {
          if(l.length) {
            l.first.takeFocus();
            sub.unsubscribe();
          }
        });
      } else {
        let sub = this.itemCmpts.changes.subscribe((l: QueryList<BoxProductComponent>) => {
          if(l.length) {
            l.first.focusRemove();
            sub.unsubscribe();
          }
        });
      }
      this.model.completeAdd();
    }
  }

  cancelAdd() {
    this.model.cancelAdd();
  }

  productRemoved(index: number, keydown: boolean) {
    if(keydown) {
      if(this.itemCmpts.length > 1) {
        let sub = this.itemCmpts.changes.subscribe((l: QueryList<BoxProductComponent>) => {
          if(l.length) {
            l.toArray()[Math.min(index, l.length - 1)].focusRemove();
            sub.unsubscribe();
          }
        });
      } else {
        if(this.addBtn.length) {
          this.addBtn.first.takeFocus();
        }
      }
    }
  }

  setValidationMessage() {
    if(!this.submitted || this.quantity.valid) {
      this.quantityValidationMessage = '';
      return;
    }

    for(let e in this.quantity.errors) {
      this.quantityValidationMessage = this.quantityMessages[e] ? this.quantityMessages[e] : e;
      return;
    }
  }
}