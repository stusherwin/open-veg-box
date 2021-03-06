import { Component, Input, Output, EventEmitter, ViewChild, forwardRef, Inject, ElementRef, OnInit, Renderer, ViewChildren, QueryList, Directive, HostListener, HostBinding, AfterViewInit, ContentChildren, ChangeDetectorRef } from '@angular/core';
import { Arrays } from '../../shared/arrays'
import { MoneyPipe } from '../../shared/pipes'
import { OrderModel } from './order.model'
import { OrderSectionModel } from './order.model'
import { OrderItemModel } from './order.model'
import { ProductQuantityComponent } from '../../products/product-quantity.component'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { Subject } from 'rxjs/Subject'
import { Observable } from 'rxjs/Observable'
import 'rxjs/add/operator/distinct'
import { Control, Validators, FORM_DIRECTIVES, FormBuilder, ControlGroup } from '@angular/common'
import { ValidationResult } from '../../shared/input.component'
import { NumberComponent } from '../../shared/number.component'
import { SelectComponent } from '../../shared/select.component'
import { EditableEditButtonComponent } from '../../shared/editable-edit-button.component'
import { EditableButtonsComponent } from '../../shared/editable-buttons.component'
import { OrderItemComponent } from './order-item.component' 
import { EditableService } from '../../shared/editable.service'

@Component({
  selector: '[cc-order-section]',
  templateUrl: 'app/customers/orders/order-section.component.html',
  directives: [ProductQuantityComponent, EditableEditButtonComponent, EditableButtonsComponent, NumberComponent, SelectComponent, FORM_DIRECTIVES, OrderItemComponent],
  pipes: [MoneyPipe]
})
export class OrderSectionComponent implements OnInit {
  @Input()
  model: OrderSectionModel

  @Input()
  heading: string;

  @Input()
  itemName: string;

  @ViewChildren('select')
  select: QueryList<SelectComponent>;

  @ViewChildren('itemCmpt')
  itemCmpts: QueryList<OrderItemComponent>;

  @ViewChildren('addBtn')
  addBtn: QueryList<EditableEditButtonComponent>;

  quantity: Control;
  form: ControlGroup;
  submitted = false;
  quantityMessages = {
    required: 'Quantity is required.',
    notGreaterThanZero: 'Quantity must be greater than zero.',
    notNumeric: 'Quantity must be a number.',
    eachMustBeWholeNumber: this.itemName == 'box'
      ? 'Boxes must have a whole number quantity.'
      : 'Products sold \'per each\' must have a whole number quantity.'
  }
  quantityValidationMessage: string;

  get key() {
    return this.heading + '-add';
  }

  constructor(private renderer: Renderer, private builder: FormBuilder, 
  @Inject(forwardRef(() => EditableService))
  private editableService: EditableService
  ) {
  }

  ngOnInit() {
    let validateQuantity: (c: Control) => ValidationResult = control => { 
      if (this.model.addingItem && this.model.addingItem.unitType == 'each' && ''+parseFloat(control.value) != ''+parseInt(control.value)) {
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

  getItemId(item: OrderItemModel) {
    return item.id;
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
      if(keydown) {
        if(this.model.itemsAvailable.length > 1) {
          let sub = this.addBtn.changes.subscribe((l: QueryList<EditableEditButtonComponent>) => {
            if(l.length) {
              l.first.takeFocus();
              sub.unsubscribe();
            }
          });
        } else {
          let sub = this.itemCmpts.changes.subscribe((l: QueryList<OrderItemComponent>) => {
            if(l.length) {
              l.first.focusRemove();
              sub.unsubscribe();
            }
          });
        }
      }
      this.model.completeAdd();
    }
  }

  cancelAdd() {
    this.model.cancelAdd();
  }

  itemRemoved(index: number, keydown: boolean) {
    if(keydown) {
      if(this.itemCmpts.length > 1) {
        let sub = this.itemCmpts.changes.subscribe((l: QueryList<OrderItemComponent>) => {
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