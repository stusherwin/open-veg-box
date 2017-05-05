import { Component, OnInit, Input, Output, Inject, forwardRef, ViewChildren, QueryList, EventEmitter, ViewChild, ElementRef, Renderer, ChangeDetectorRef } from '@angular/core';
import { ActiveElementDirective } from '../../shared/active-elements'
import { CustomerModel } from './customer.model'
import { OrderComponent } from '../orders/order.component'
import { PreserveLinesPipe, MoneyPipe } from '../../shared/pipes'
import { Customer } from '../customer'
import { CustomerPageService } from './customer-page.component'
import { CustomerService } from '../customer.service'
import { EditableEditButtonComponent } from '../../shared/editable-edit-button.component'
import { EditableButtonsComponent } from '../../shared/editable-buttons.component'
import { TextComponent, TextAreaComponent } from '../../shared/input.component'
import { Control, Validators, FORM_DIRECTIVES, FormBuilder, ControlGroup } from '@angular/common'
import { EditableComponent, EditableAreaComponent } from '../../shared/editable.component'

@Component({
  selector: 'cc-details-page',
  templateUrl: 'app/customers/customer-page/details-page.component.html',
  directives: [OrderComponent, ActiveElementDirective, EditableEditButtonComponent, TextComponent, EditableButtonsComponent, EditableComponent, EditableAreaComponent],
  pipes: [PreserveLinesPipe, MoneyPipe]
})
export class DetailsPageComponent implements OnInit {
  model: CustomerModel;

  firstNameValidators = [Validators.required];

  constructor(
      @Inject(forwardRef(() => CustomerPageService))
      private page: CustomerPageService,
      private customerService: CustomerService,
      private builder: FormBuilder) {
    this.model = new CustomerModel(page.customer, customerService);
  }

  ngOnInit() {
  }
}