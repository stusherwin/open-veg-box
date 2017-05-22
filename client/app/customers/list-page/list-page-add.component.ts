import { Component, Input, Output, EventEmitter, ViewChild, forwardRef, Inject, ElementRef, Renderer, OnInit, ViewChildren, QueryList } from '@angular/core';
import { Customer } from '../customer'
import { ROUTER_DIRECTIVES } from '@angular/router-deprecated';
import { ValidatableComponent } from '../../shared/validatable.component';
import { AddCustomerModel } from './customer.model'
import { TextComponent } from '../../shared/input.component'
import { Control, Validators, FORM_DIRECTIVES, FormBuilder, ControlGroup } from '@angular/common'
import { ButtonComponent } from '../../shared/button.component'

@Component({
  selector: 'cc-list-page-add',
  templateUrl: 'app/customers/list-page/list-page-add.component.html',
  directives: [ROUTER_DIRECTIVES, ValidatableComponent, TextComponent, ButtonComponent],
})
export class ListPageAddComponent implements OnInit {
  customer = new Customer(0, '', '', '', '', '', '');
  adding: boolean;
  rowFocused: boolean;

  // @ViewChild('customerName')
  // customerName: TextComponent;

  @ViewChild('customerName')
  customerName: ElementRef;

  @ViewChild('add')
  addButton: ElementRef;

  @Input()
  showAddMessage: boolean;

  @Input()
  loaded: boolean;

  @Input()
  model: AddCustomerModel;

  @ViewChildren(ValidatableComponent)
  validatables: QueryList<ValidatableComponent>

  constructor(private renderer: Renderer, private builder: FormBuilder) {
  }

  firstName: Control;
  surname: Control;
  form: ControlGroup;

  ngOnInit() {
    this.firstName = new Control('', Validators.compose([Validators.required]))
    this.surname = new Control('', Validators.compose([Validators.required]))
    this.form = this.builder.group({
      firstName: this.firstName,
      surname: this.surname
    })
  }

  validated = false;
  get valid() {
    return !this.validated
      || !this.validatables
      || !this.validatables.length
      || this.validatables.toArray().every(v => v.valid);
  }

  get emailValid() {
    return !this.customer.email || /^.+\@.+\..+$/.test(this.customer.email);
  }

  startAdd() {
    this.adding = true;
    this.validated = false;
    this.resetCustomer();
    setTimeout(() => {
      this.renderer.invokeElementMethod(window, 'scrollTo', [0, 0])
      // this.customerName.focus();
      this.renderer.invokeElementMethod(this.customerName.nativeElement, 'focus', [])
    });
  }

  completeAdd() {
    this.validated = true;

    if(this.valid) {
      this.model.add(this.customer);
      this.adding = false;
      this.validated = false;
    } else {
      setTimeout(() => this.renderer.invokeElementMethod(this.customerName.nativeElement, 'focus', []));
    }
  }

  cancelAdd() {
    this.adding = false;
    this.validated = false;
  } 

  onActivate() {
    this.rowFocused = true;
  }

  onDeactivate() {
    if(this.adding) {
      this.adding = false;
    }
    this.rowFocused = false;
  }

  resetCustomer() {
    // this.customer.name = '';
    this.customer.firstName = '';
    this.customer.surname = '';
    this.customer.address = '';
    this.customer.email = '';
    this.customer.tel1 = '';
    this.customer.tel2 = '';
  }
}