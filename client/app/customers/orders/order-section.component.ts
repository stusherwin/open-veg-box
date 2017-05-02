import { Component, Input, Output, EventEmitter, ViewChild, forwardRef, Inject, ElementRef, OnInit, Renderer, ViewChildren, QueryList, Directive, HostListener, HostBinding, AfterViewInit, ContentChildren, ChangeDetectorRef } from '@angular/core';
import { ActiveElementDirective, ActivateOnFocusDirective, DeactivateOnBlurDirective } from '../../shared/active-elements'
import { DistributeWidthDirective, DistributeWidthSumDirective } from '../../shared/distribute-width.directive'
import { OrderItemQuantityComponent } from './order-item-quantity.component'
import { EditableValueComponent } from '../../shared/editable-value.component'
import { Arrays } from '../../shared/arrays'
import { NumericDirective } from '../../shared/numeric.directive'
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

@Component({
  template: `
    <a *ngIf="visible" class="button-new-small"
      tabindex="1"
      (click)="click.emit(null)"
      (keydown.Enter)="click.emit(null)"><i class="icon-{{icon}}"></i>
    </a>
  `,
  selector: 'cc-editable-button',
  directives: [ActiveElementDirective, ActivateOnFocusDirective, DeactivateOnBlurDirective]
})
export class EditableEditButtonComponent implements OnInit {
  visible: boolean = true

  @Input()
  key: string

  @Input()
  icon: string

  @Input()
  tabindex: number = 9999
  
  @Output()
  click = new EventEmitter<any>()

  ngOnInit() {
  }
}

@Component({
  template: `
    <span *ngIf="visible">
      <button class="button-new-small"
        [disabled]="disabled"
        tabindex="1"
        (click)="ok.emit(null)"
        (keydown.Enter)="ok.emit(null)">
        <i class="icon-ok"></i>
      </button>
      <a class="button-new-small"
        tabindex="1"
        (click)="cancel.emit(null)"
        (keydown.Enter)="cancel.emit(null)"><i class="icon-cancel"></i>
      </a>
    </span>
  `,
  selector: 'cc-editable-buttons'
})
export class EditableButtonsComponent implements OnInit {
  visible: boolean = true

  @Input()
  key: string

  @Input()
  disabled: boolean

  @Output()
  ok = new EventEmitter<any>()

  @Output()
  cancel = new EventEmitter<any>()

  ngOnInit() {
  }
}

export class InputComponent {
  isValid: boolean = true;

  validate(): boolean {
    return true;
  }
}

@Component({
  template: `
    <span class="input-wrapper" [class.invalid]="!isValid">
      <input type="text" class="{{cssClass}}"
            [(ngModel)]="value"
            (ngModelChange)="valueChange.emit($event)"
            [ngFormControl]="control"
            tabindex="1" />
      <i *ngIf="!isValid" class="icon-warning" title="{{message}}"></i>
    </span>
  `,
  selector: 'cc-text',
  directives: [FORM_DIRECTIVES]
})
export class TextComponent extends InputComponent implements OnInit {
  isValid: boolean = true;

  @Input()
  cssClass: string;

  @Input()
  value: string;

  @Input()
  valid: string

  @Input()
  message: string

  @Output()
  valueChange = new EventEmitter<string>()

  constructor() {
    super();
  }

  ngOnInit() {
  }

  validate(): boolean {
    let $value = this.value;
    this.isValid = eval(this.valid);
    return this.isValid;
  }
}

@Component({
  template: `
    <span class="input-wrapper" [class.invalid]="!isValid">
      <input #input type="text" class="{{cssClass}}"
            [(ngModel)]="stringValue"
            (ngModelChange)="updateValue($event)"
            [ngFormControl]="control"
            tabindex="1" />
      <i *ngIf="!isValid" class="icon-warning" title="{{message}}"></i>
    </span>
  `,
  selector: 'cc-number',
  directives: [FORM_DIRECTIVES]
})
export class NumberComponent extends InputComponent implements OnInit {
  stringValue: string;
  isValid: boolean = true;

  @Input()
  cssClass: string;

  @Input()
  value: number;

  @Input()
  fixedDecimals: boolean = false;

  @Input()
  decimalPrecision: number;

  // @Input()
  // valid: string

  // @Input()
  // message: string

  @Input()
  control: Control

  @Output()
  valueChange = new EventEmitter<number>()

  constructor(private changeDetector: ChangeDetectorRef) {
    super();
  }

  ngOnInit() {
    this.stringValue = this.toStringValue(this.value);
  }

  updateValue(stringValue: string) {
    this.value = this.toDecimalValue(stringValue);
    this.valueChange.emit(this.value);
    this.changeDetector.detectChanges();
  }

  // validate(): boolean {
  //   let $value = this.value;
  //   this.isValid = eval(this.valid);
  //   return this.isValid;
  // }

  private toStringValue(value: number): string {
    if(this.fixedDecimals) {
      return value.toFixed(this.decimalPrecision);
    }

    var result = value.toFixed(this.decimalPrecision);
    while (result !== '0' && (result.endsWith('.') || (result.indexOf('.') != -1 && result.endsWith('0')))) {
      result = result.substring(0, result.length - 1);
    }
    return result;
  }

  private toDecimalValue(value: string): number {
    var parsed = parseFloat(value);
    if( isNaN(parsed) ) {
      return 0;
    }

    return parseFloat(parsed.toFixed(this.decimalPrecision));
  }

  static isGreaterThanZero(control: Control): ValidationResult { 
    if (parseFloat(control.value) <= 0) {
      return { "isNotGreaterThanZero": true };
    }
 
    return null;
  }

  static isNumeric(control: Control): ValidationResult { 
    if (isNaN(parseFloat(control.value))) {
      return { "isNotNumeric": true };
    }
 
    return null;
  }

}


@Component({
  template: `
    <select #select class="{{cssClass}}"
        tabindex="1"
        [(ngModel)]="value"
        (ngModelChange)="valueChange.emit($event)">
      <option *ngFor="let o of options" [ngValue]="o">{{getText(o)}}</option>
    </select>
  `,
  selector: 'cc-select'
})
export class SelectComponent extends InputComponent implements OnInit {
  @Input()
  cssClass: string;

  @Input()
  value: string;

  @Input()
  textProperty: string

  @Input()
  options: any[]

  @Output()
  valueChange = new EventEmitter<string>()

  constructor() {
    super();
  }

  getText(option: any) {
    return option[this.textProperty];
  }

  ngOnInit() {
  }
}



@Component({
  selector: '[cc-order-item]',
  templateUrl: 'app/customers/orders/order-item.component.html',
  directives: [ActiveElementDirective, ActivateOnFocusDirective, DeactivateOnBlurDirective, DistributeWidthDirective, OrderItemQuantityComponent, DistributeWidthSumDirective, EditableValueComponent, NumericDirective, ProductQuantityComponent, EditableEditButtonComponent, EditableButtonsComponent, TextComponent, NumberComponent, SelectComponent, FORM_DIRECTIVES],
  pipes: [MoneyPipe]
})
export class OrderItemComponent {
  @Input()
  model: OrderItemModel

  quantity: Control;
  form: ControlGroup;
  constructor(private renderer: Renderer, private builder: FormBuilder) {
    this.quantity = new Control('', Validators.compose([Validators.required, NumberComponent.isNumeric, NumberComponent.isGreaterThanZero]))
    this.form = builder.group({
      quantity: this.quantity
    })
  }

  submitted = false;
  startEdit() {
    this.submitted = false;
    this.model.startEdit();
  }

  completeEdit() {
    this.submitted = true;
    
    if(this.quantity.valid) {
      this.model.completeEdit();
    }
  }

  cancelEdit() {
    this.model.cancelEdit();
  }
}


@Component({
  selector: '[cc-order-section]',
  templateUrl: 'app/customers/orders/order-section.component.html',
  directives: [ActiveElementDirective, ActivateOnFocusDirective, DeactivateOnBlurDirective, DistributeWidthDirective, OrderItemQuantityComponent, DistributeWidthSumDirective, EditableValueComponent, NumericDirective, ProductQuantityComponent, EditableEditButtonComponent, EditableButtonsComponent, TextComponent, NumberComponent, SelectComponent, FORM_DIRECTIVES, OrderItemComponent],
  pipes: [MoneyPipe]
})
export class OrderSectionComponent implements OnInit {
  itemNameArticle: string;

  @Input()
  model: OrderSectionModel

  @Input()
  heading: string;

  @Input()
  itemName: string;

  @ViewChild('add')
  addBtn: ElementRef;

  @ViewChild('select')
  select: ElementRef;

  @ViewChild('editable')
  editable: EditableValueComponent

  @ViewChildren('remove')
  removeBtns: QueryList<ElementRef>

  quantity: Control;
  form: ControlGroup;
  constructor(private renderer: Renderer, private builder: FormBuilder) {
    this.quantity = new Control('', Validators.compose([Validators.required, NumberComponent.isNumeric, NumberComponent.isGreaterThanZero]))
    this.form = builder.group({
      quantity: this.quantity
    })
  }

  ngOnInit() {
    this.itemNameArticle = /^[aeiou]/i.test(this.itemName) ? 'an' : 'a';
  }

  getItemId(item: OrderItemModel) {
    return item.id;
  }

  submitted = false;

  startAdd(){
    this.submitted = false;
    this.model.startAdd();
  }

  completeAdd() {
    this.submitted = true;

    if(this.quantity.valid) {
      this.model.completeAdd();
    }
  }

  cancelAdd() {
    this.model.cancelAdd();
  }
}

interface ValidationResult{
   [key:string]:boolean;
}