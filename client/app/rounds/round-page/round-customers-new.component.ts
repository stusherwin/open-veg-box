import { Component, Input, Output, EventEmitter, ViewChild, forwardRef, Inject, ElementRef, OnInit, Renderer, ViewChildren, QueryList, Directive, HostListener, HostBinding, AfterViewInit, ContentChildren, ChangeDetectorRef } from '@angular/core';
import { Arrays } from '../../shared/arrays'
import { RoundCustomersModel } from './round-customers.model'
import { RoundCustomerModel } from './round-customers.model'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { Subject } from 'rxjs/Subject'
import { Observable } from 'rxjs/Observable'
import 'rxjs/add/operator/distinct'
import { Control, Validators, FORM_DIRECTIVES, FormBuilder, ControlGroup } from '@angular/common'
import { SelectComponent, ValidationResult } from '../../shared/input.component'
import { EditableEditButtonComponent } from '../../shared/editable-edit-button.component'
import { EditableButtonsComponent } from '../../shared/editable-buttons.component'
import { RoundCustomerComponent } from './round-customer-new.component' 
import { EditableService } from '../../shared/editable.service'
import { Customer } from '../../customers/customer'
import { Round, RoundCustomer } from '../round'
import { RoundService } from '../round.service'
import { CustomerService } from '../../customers/customer.service'

@Component({
  selector: 'cc-round-customers',
  templateUrl: 'app/rounds/round-page/round-customers-new.component.html',
  directives: [EditableEditButtonComponent, EditableButtonsComponent, SelectComponent, FORM_DIRECTIVES, RoundCustomerComponent]
})
export class RoundCustomersComponent implements OnInit {
  model: RoundCustomersModel

  @Input()
  key: string

  @Input()
  round: Round

  @Input()
  customers: Customer[]

  @ViewChildren('select')
  select: QueryList<SelectComponent>;

  @ViewChildren('itemCmpt')
  itemCmpts: QueryList<RoundCustomerComponent>;

  @ViewChildren('addBtn')
  addBtn: QueryList<EditableEditButtonComponent>;

  constructor(private renderer: Renderer,
  @Inject(forwardRef(() => EditableService))
  private editableService: EditableService,
  private roundService: RoundService,
  private customerService: CustomerService
  ) {
  }

  ngOnInit() {
    this.model = new RoundCustomersModel(
      this.round,
      this.customers,
      this.roundService,
      this.customerService)

    this.editableService.currentlyEditing.subscribe((key: any) => {
      if(!this.model.adding && key == this.key) {
        this.startAdd();
      } else if(this.model.adding && key != this.key) {
        this.cancelAdd();
      }
    })
  }

  getCustomerId(customer: RoundCustomerModel) {
    return customer.id;
  }

  startAdd(){
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
    if(this.model.customersAvailable.length > 1) {
      let sub = this.addBtn.changes.subscribe((l: QueryList<EditableEditButtonComponent>) => {
        if(l.length) {
          l.first.takeFocus();
          sub.unsubscribe();
        }
      });
    } else {
      let sub = this.itemCmpts.changes.subscribe((l: QueryList<RoundCustomerComponent>) => {
        if(l.length) {
          l.first.focusRemove();
          sub.unsubscribe();
        }
      });
    }
    this.model.completeAdd();
  }

  cancelAdd() {
    this.model.cancelAdd();
  }

  customerRemoved(index: number, keydown: boolean) {
    if(keydown) {
      if(this.itemCmpts.length > 1) {
        let sub = this.itemCmpts.changes.subscribe((l: QueryList<RoundCustomerComponent>) => {
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