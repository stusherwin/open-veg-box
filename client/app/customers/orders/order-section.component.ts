import { Component, Input, Output, EventEmitter, ViewChild, forwardRef, Inject, ElementRef, OnInit, Renderer, ViewChildren, QueryList, Directive, HostListener, HostBinding, AfterViewInit, ContentChildren } from '@angular/core';
import { ActiveElementDirective, ActivateOnFocusDirective, DeactivateOnBlurDirective } from '../../shared/active-elements'
import { DistributeWidthDirective, DistributeWidthSumDirective } from '../../shared/distribute-width.directive'
import { OrderItemQuantityComponent } from './order-item-quantity.component'
import { EditableValueComponent } from '../../shared/editable-value.component'
import { Arrays } from '../../shared/arrays'
import { NumericDirective } from '../../shared/numeric.directive'
import { MoneyPipe } from '../../shared/pipes'
import { OrderModel, OrderAvailableItem } from './order.model'
import { OrderSectionModel } from './order-section.model'
import { OrderItemModel } from './order-item.model'
import { ProductQuantityComponent } from '../../products/product-quantity.component'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { Subject } from 'rxjs/Subject'
import { Observable } from 'rxjs/Observable'
import 'rxjs/add/operator/distinct'

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
      <a class="button-new-small"
        tabindex="1"
        (click)="ok.emit(null)"
        (keydown.Enter)="ok.emit(null)">
        <i class="icon-ok"></i>
      </a>
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
            (focus)="onInputFocus()"
            (blur)="onInputBlur()"
            tabindex="1" />
      <i *ngIf="!isValid" class="icon-warning" title="{{message}}"></i>
    </span>
  `,
  selector: 'cc-text'
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
            tabindex="1" />
      <i *ngIf="!isValid" class="icon-warning" title="{{message}}"></i>
    </span>
  `,
  selector: 'cc-number'
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

  @Input()
  valid: string

  @Input()
  message: string

  @Output()
  valueChange = new EventEmitter<number>()

  constructor() {
    super();
  }

  ngOnInit() {
    this.stringValue = this.toStringValue(this.value);
  }

  updateValue(stringValue: string) {
    this.value = this.toDecimalValue(stringValue);
    this.valueChange.emit(this.value);
  }

  validate(): boolean {
    let $value = this.value;
    this.isValid = eval(this.valid);
    return this.isValid;
  }

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
  selector: '[cc-order-section]',
  templateUrl: 'app/customers/orders/order-section.component.html',
  directives: [ActiveElementDirective, ActivateOnFocusDirective, DeactivateOnBlurDirective, DistributeWidthDirective, OrderItemQuantityComponent, DistributeWidthSumDirective, EditableValueComponent, NumericDirective, ProductQuantityComponent, EditableEditButtonComponent, EditableButtonsComponent, TextComponent, NumberComponent, SelectComponent],
  pipes: [MoneyPipe]
})
export class OrderSectionComponent implements OnInit {
  orderItemPadding = 10;
  quantity: number = 1;
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

  constructor(private renderer: Renderer) {
  }

  ngOnInit() {
    this.itemNameArticle = /^[aeiou]/i.test(this.itemName) ? 'an' : 'a';
  }

  onOrderItemRemove(item: OrderItemModel, keyboard: boolean) {
    let index = this.model.items.findIndex(i => i == item);
    item.remove();
    // if(keyboard) {
    //   if(this.model.items.length) {
    //     setTimeout(() => {
    //       let nextRemoveFocusIndex = Math.min(index, this.model.items.length - 1);
    //       let nextFocusBtn = this.removeBtns.toArray()[nextRemoveFocusIndex];
    //       this.renderer.invokeElementMethod(nextFocusBtn.nativeElement, 'focus', [])
    //     })
    //   } else if(this.model.itemsAvailable.length) {
    //     setTimeout(() => this.renderer.invokeElementMethod(this.addBtn.nativeElement, 'focus', []))
    //   }
    // } else {
    //   if(this.model.items.length) {
    //     let nextRemoveFocusIndex = Math.min(index, this.model.items.length - 1);
    //     let nextFocusBtn = this.removeBtns.toArray()[nextRemoveFocusIndex];
    //     this.renderer.invokeElementMethod(nextFocusBtn.nativeElement, 'blur', [])
    //   }
    // }
 }

  onAddStart() {
    // this.renderer.invokeElementMethod(this.select.nativeElement, 'focus', []);
    // this.model.startAdd();
  }

  onAddOk(tabbedAway: boolean) {
    if(tabbedAway && this.model.itemsAvailable.length > 1) {
      setTimeout(() => this.renderer.invokeElementMethod(this.addBtn.nativeElement, 'focus', []))
    }

    this.model.add();
    //this.editable.endEdit();
  }

  onAddCancel() {
    this.model.cancelAdd();
    //this.editable.endEdit();
  }

  onAddingItemQuantityChange(quantity: number) {
    this.model.recalculateTotal();
  }

  getItemId(item: OrderItemModel) {
    return item.id;
  }
}