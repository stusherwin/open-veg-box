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
import { Validators } from '@angular/common'
import { EditableTextComponent } from '../../shared/editable-text.component'
import { EditableTextAreaComponent } from '../../shared/editable-textarea.component'

@Component({
  selector: 'cc-details-page',
  templateUrl: 'app/customers/customer-page/details-page.component.html',
  directives: [OrderComponent, ActiveElementDirective, EditableEditButtonComponent, TextComponent, EditableButtonsComponent, EditableTextComponent, EditableTextAreaComponent],
  pipes: [PreserveLinesPipe, MoneyPipe]
})
export class DetailsPageComponent implements OnInit {
  model: CustomerModel;

  firstNameValidators = [Validators.required];

  constructor(
      @Inject(forwardRef(() => CustomerPageService))
      private page: CustomerPageService,
      private customerService: CustomerService) {
    this.model = new CustomerModel(page.customer, customerService);
  }

  ngOnInit() {
  }
}