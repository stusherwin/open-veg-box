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
import { OrderDiscountComponent } from './order-discount.component' 
import { EditableService } from '../../shared/editable.service'

@Component({
  selector: '[cc-order-discounts]',
  templateUrl: 'app/customers/orders/order-discounts-section.component.html',
  directives: [ProductQuantityComponent, EditableEditButtonComponent, EditableButtonsComponent, NumberComponent, SelectComponent, FORM_DIRECTIVES, OrderDiscountComponent],
  pipes: [MoneyPipe]
})
export class OrderDiscountsSectionComponent implements OnInit {
  @Input()
  model: OrderDiscountsSectionModel

  @ViewChildren('itemCmpt')
  itemCmpts: QueryList<OrderDiscountComponent>;

  @ViewChildren('addBtn')
  addBtn: QueryList<EditableEditButtonComponent>;

  constructor(private renderer: Renderer, private builder: FormBuilder, 
  @Inject(forwardRef(() => EditableService))
  private editableService: EditableService
  ) {
  }

  ngOnInit() {
  }

  getItemId(item: OrderDiscountModel) {
    return item.id;
  }

  itemRemoved(index: number, keydown: boolean) {
    if(keydown) {
      if(this.itemCmpts.length > 1) {
        let sub = this.itemCmpts.changes.subscribe((l: QueryList<OrderDiscountComponent>) => {
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

  startAdd() {
    this.model.startAdd();
    this.model.completeAdd();
  }
}