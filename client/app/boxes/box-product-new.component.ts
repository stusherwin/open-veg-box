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
import { NumberComponent, SelectComponent, ValidationResult } from '../shared/input.component'
import { EditableEditButtonComponent } from '../shared/editable-edit-button.component'
import { EditableButtonsComponent } from '../shared/editable-buttons.component'
import { EditableService } from '../shared/editable.service'
 
@Component({
  selector: '[cc-box-product]',
  templateUrl: 'app/boxes/box-product-new.component.html',
  directives: [ProductQuantityComponent, EditableEditButtonComponent, EditableButtonsComponent, NumberComponent, SelectComponent, FORM_DIRECTIVES],
  pipes: [MoneyPipe]
})
export class BoxProductComponent implements OnInit {
  hover: boolean;
  focused: boolean;
  wasFocused: boolean;

  @Input()
  key: string
  
  @Input()
  model: BoxProductModel

  @Output()
  remove = new EventEmitter<boolean>()

  @ViewChildren('quantityCmpt')
  quantityCmpt: QueryList<NumberComponent>

  @ViewChild('removeBtn')
  removeBtn: ElementRef;

  @ViewChildren('editBtn')
  editBtn: QueryList<EditableEditButtonComponent>;

  @HostListener('mouseleave') 
  mouseleave() {
    this.hover = false;
  }

  get editKey() {
    return this.key + '-edit';
  }

  get removeKey() {
    return this.key + '-remove';
  }

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
  private editableService: EditableService
  ) {
  }

  ngOnInit() {
    let validateQuantity: (c: Control) => ValidationResult = control => { 
      if (this.model.unitType == 'each' && ''+parseFloat(control.value) != ''+parseInt(control.value)) {
        return { "eachMustBeWholeNumber": true };
      }
  
      return null;
    };
  
    this.quantity = new Control('', Validators.compose([Validators.required, NumberComponent.isNumeric, NumberComponent.isGreaterThanZero, validateQuantity]))
    this.form = this.builder.group({
      quantity: this.quantity
    })

    this.editableService.currentlyEditing.subscribe((key: string) => {
      if(this.model.editing && key != this.editKey) {
        this.cancelEdit();
      }
    })
  }

  startEdit() {
    if(this.model.editing) {
      return;
    }

    this.wasFocused = this.focused;
    this.focused = false;
    this.submitted = false;
    this.editableService.startEdit(this.editKey);
    this.model.startEdit();
    let sub = this.quantityCmpt.changes.subscribe((l: QueryList<NumberComponent>) => {
      if(l.length) {
        l.first.focus();
        sub.unsubscribe();
      }
    });
  }

  completeEdit() {
    this.submitted = true;
    
    if(!this.quantity.valid) {
      this.setValidationMessage();
    } else {
      if(this.wasFocused) {
        this.wasFocused = false;
        let sub = this.editBtn.changes.subscribe((l: QueryList<EditableEditButtonComponent>) => {
          if(l.length) {
            l.first.takeFocus();
            sub.unsubscribe();
          }
        })
      }
      this.model.completeEdit();
    }
  }

  cancelEdit() {
    if(this.wasFocused) {
      this.wasFocused = false;
      let sub = this.editBtn.changes.subscribe((l: QueryList<EditableEditButtonComponent>) => {
        if(l.length) {
          l.first.takeFocus();
          sub.unsubscribe();
        }
      })
    }
    this.model.cancelEdit();
  }

  removeProduct(keydown: boolean) {
    this.editableService.startEdit(this.removeKey);
    this.model.remove();
    this.remove.emit(keydown);
  }

  focusRemove() {
    this.renderer.invokeElementMethod(this.removeBtn.nativeElement, 'focus', []);
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