import { Component, Input, Output, EventEmitter, ViewChild, forwardRef, Inject, ElementRef, Renderer, OnInit, ViewChildren, QueryList } from '@angular/core';
import { Customer } from '../customer'
import { HeadingComponent } from '../../shared/heading.component'
import { CustomerAddressComponent } from './customer-address.component'
import { CustomerEmailComponent } from './customer-email.component'
import { CustomerTelComponent } from './customer-tel.component'
import { ROUTER_DIRECTIVES } from '@angular/router-deprecated';
import { ActiveElementDirective, ActivateOnFocusDirective, DeactivateOnBlurDirective } from '../../shared/active-elements'
import { ValidatableComponent } from '../../shared/validatable.component';
import { AddCustomerModel } from './customer.model'

@Component({
  selector: 'cc-list-page-add',
  templateUrl: 'app/customers/list-page/list-page-add.component.html',
  directives: [HeadingComponent, CustomerAddressComponent, CustomerEmailComponent, CustomerTelComponent, ROUTER_DIRECTIVES, ActiveElementDirective, ActivateOnFocusDirective, DeactivateOnBlurDirective, ValidatableComponent],
})
export class ListPageAddComponent implements OnInit {
  customer = new Customer(0, '', '', '', '', '', '');
  adding: boolean;
  rowFocused: boolean;

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

  @ViewChild('active')
  active: ActiveElementDirective;

  @ViewChildren(ValidatableComponent)
  validatables: QueryList<ValidatableComponent>

  constructor(private renderer: Renderer) {
  }
   
  ngOnInit() {
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
      this.renderer.invokeElementMethod(this.customerName.nativeElement, 'focus', [])
    });
  }

  completeAdd() {
    this.validated = true;

    if(this.valid) {
      this.model.add(this.customer);
      this.adding = false;
      this.active.makeInactive();
      this.validated = false;
    } else {
      setTimeout(() => this.renderer.invokeElementMethod(this.customerName.nativeElement, 'focus', []));
    }
  }

  cancelAdd() {
    this.adding = false;
    this.active.makeInactive();
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
    this.customer.name = '';
    this.customer.address = '';
    this.customer.email = '';
    this.customer.tel1 = '';
    this.customer.tel2 = '';
  }
}