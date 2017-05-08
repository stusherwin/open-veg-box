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
import { OrderItemComponent } from './order-item.component' 
import { EditableService } from '../../shared/editable.service'

@Component({
  selector: '[cc-order-section]',
  templateUrl: 'app/customers/orders/order-section.component.html',
  directives: [ActiveElementDirective, ActivateOnFocusDirective, DeactivateOnBlurDirective, DistributeWidthDirective, OrderItemQuantityComponent, DistributeWidthSumDirective, EditableValueComponent, NumericDirective, ProductQuantityComponent, EditableEditButtonComponent, EditableButtonsComponent, NumberComponent, SelectComponent, FORM_DIRECTIVES, OrderItemComponent],
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

  get key() {
    return this.heading + '-add';
  }

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

  completeAdd() {
    this.submitted = true;

    if(this.quantity.valid) {
      this.model.completeAdd();
    }
  }

  cancelAdd() {
    this.model.cancelAdd();
  }

  itemRemoved(index: number, keydown: boolean) {
    console.log('itemRemoved(' + index + ', ' + keydown + ')')
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
}