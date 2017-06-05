import { Component, OnInit, Input, Output, Inject, forwardRef, ViewChildren, QueryList, EventEmitter, ViewChild, ElementRef, Renderer, ChangeDetectorRef } from '@angular/core';
import { CustomerModel } from './customer.model'
import { PreserveLinesPipe } from '../../shared/pipes'
import { Customer } from '../customer'
import { CustomerPageService } from './customer-page.component'
import { CustomerService } from '../customer.service'
import { Validators } from '@angular/common'
import { EditableTextComponent } from '../../shared/editable-text.component'
import { EditableTextAreaComponent } from '../../shared/editable-textarea.component'

@Component({
  selector: 'cc-contact-details-page',
  templateUrl: 'app/customers/customer-page/contact-details-page.component.html',
  directives: [EditableTextComponent, EditableTextAreaComponent],
  pipes: [PreserveLinesPipe]
})
export class ContactDetailsPageComponent implements OnInit {
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