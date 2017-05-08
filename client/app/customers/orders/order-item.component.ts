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
import { NumberComponent, SelectComponent } from '../../shared/input.component'
import { EditableEditButtonComponent } from '../../shared/editable-edit-button.component'
import { EditableButtonsComponent } from '../../shared/editable-buttons.component'
import { EditableService } from '../../shared/editable.service'
 
@Component({
  selector: '[cc-order-item]',
  templateUrl: 'app/customers/orders/order-item.component.html',
  directives: [ActiveElementDirective, ActivateOnFocusDirective, DeactivateOnBlurDirective, DistributeWidthDirective, OrderItemQuantityComponent, DistributeWidthSumDirective, EditableValueComponent, NumericDirective, ProductQuantityComponent, EditableEditButtonComponent, EditableButtonsComponent, NumberComponent, SelectComponent, FORM_DIRECTIVES],
  pipes: [MoneyPipe]
})
export class OrderItemComponent implements OnInit {
  hover: boolean;
  focused: boolean;

  @Input()
  key: string
  
  @Input()
  model: OrderItemModel

  @Output()
  remove = new EventEmitter<boolean>()

  @ViewChildren('quantityCmpt')
  quantityCmpt: QueryList<NumberComponent>

  @ViewChild('removeBtn')
  removeBtn: ElementRef;

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
  
  constructor(private renderer: Renderer, private builder: FormBuilder, 
  @Inject(forwardRef(() => EditableService))
  private editableService: EditableService
  ) {
    this.quantity = new Control('', Validators.compose([Validators.required, NumberComponent.isNumeric, NumberComponent.isGreaterThanZero]))
    this.form = builder.group({
      quantity: this.quantity
    })
  }

  ngOnInit() {
    this.editableService.currentlyEditing.subscribe((key: string) => {
      if(this.model.editing && key != this.editKey) {
        this.cancelEdit();
      }
    })
  }

  startEdit() {
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
    
    if(this.quantity.valid) {
      this.model.completeEdit();
    }
  }

  cancelEdit() {
    this.model.cancelEdit();
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