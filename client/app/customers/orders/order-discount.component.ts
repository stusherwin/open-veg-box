import { Component, Input, Output, EventEmitter, ViewChild, forwardRef, Inject, ElementRef, OnInit, Renderer, ViewChildren, QueryList, Directive, HostListener, HostBinding, AfterViewInit, ContentChildren, ChangeDetectorRef } from '@angular/core';
import { Arrays } from '../../shared/arrays'
import { MoneyPipe } from '../../shared/pipes'
import { OrderModel } from './order.model'
import { OrderDiscountsSectionModel } from './order.model'
import { OrderDiscountModel } from './order.model'
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
import { EditableService } from '../../shared/editable.service'
import { ButtonComponent } from '../../shared/button.component'
 
@Component({
  selector: '[cc-order-discount]',
  templateUrl: 'app/customers/orders/order-discount.component.html',
  directives: [ProductQuantityComponent, EditableEditButtonComponent, EditableButtonsComponent, NumberComponent, SelectComponent, FORM_DIRECTIVES, ButtonComponent],
  pipes: [MoneyPipe]
})
export class OrderDiscountComponent implements OnInit {
  hover: boolean;
  focused: boolean;
  wasFocused: boolean;

  @Input()
  key: string
  
  @Input()
  model: OrderDiscountModel

  @Output()
  remove = new EventEmitter<boolean>()

  get removeKey() {
    return this.key + '-remove';
  }
  
  @ViewChild('removeBtn')
  removeBtn: ElementRef;

  constructor(private renderer: Renderer, private builder: FormBuilder, 
  @Inject(forwardRef(() => EditableService))
  private editableService: EditableService
  ) {
  }

  ngOnInit() {
  }

  removeItem(keydown: boolean) {
    this.editableService.startEdit(this.removeKey);
    this.model.remove();
    this.remove.emit(keydown);
  }

  focusRemove() {
    this.renderer.invokeElementMethod(this.removeBtn.nativeElement, 'focus', []);
  }
}