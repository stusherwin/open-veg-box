import { Component, OnInit, Input, Output, Inject, forwardRef, ViewChildren, QueryList, EventEmitter, ViewChild, ElementRef, Renderer, ChangeDetectorRef } from '@angular/core';
import { CustomerModel } from './customer.model'
import { OrderComponent } from '../orders/order.component'
import { MoneyPipe, DateStringPipe, CountPipe, PreserveLinesPipe } from '../../shared/pipes'
import { Customer, PaymentMethod, paymentMethods } from '../customer'
import { CustomerPageService } from './customer-page.component'
import { CustomerService } from '../customer.service'
import { DateString } from '../../shared/dates'
import { ButtonComponent } from '../../shared/button.component'
import { ProductQuantityComponent } from '../../products/product-quantity.component'
import { NumberComponent } from '../../shared/number.component'
import { DateComponent } from '../../shared/date.component'
import { Control, Validators, FORM_DIRECTIVES, FormBuilder, ControlGroup } from '@angular/common'
import { ApiPastPayments, ApiPastPayment } from '../customer.service'
import { EditableSelectComponent } from '../../shared/editable-select.component'
import { EditableTextAreaComponent } from '../../shared/editable-textarea.component'
import { ValidationResult } from '../../shared/input.component'

export class PastPaymentModel {
  constructor(
    public date: DateString,
    public amount: number,
    public notes: string
  ) {
  }

  get hasNotes(): boolean {
    return this.notes && !!this.notes.replace(/\s/g, '').length;
  }

  static fromApi(api: ApiPastPayment) {
    return new PastPaymentModel(
      DateString.fromJSONString(api.date),
      api.amount,
      api.notes);
  }
}

export class PaymentsModel {
  currentBalance: number = 0;
  pastPaymentsTotal: number = 0;
  pastPayments: PastPaymentModel[] = []
  paymentDateOptions: string = 'today'
  paymentAmountOptions: string = 'outstanding'
  paymentAmount: number = 0;
  paymentDate: DateString
  paymentNotes: string
  todaysDate: DateString = DateString.fromDate(new Date());
  loading = true;
  makingPayment = false;
  paymentMethodOptions = paymentMethods;
  paymentMethod: PaymentMethod;
  paymentDetails: string;

  get paymentAmountOptionsVisible() {
    return this.currentBalance < 0;
  }

  constructor(private customer: Customer, private service: CustomerService) {
    this.paymentMethod = paymentMethods.find(p => p.value == customer.paymentMethod);
    this.paymentDetails = customer.paymentDetails;
  }

  load() {
    this.service.getPastPayments(this.customer.id).subscribe(api => {
      this.currentBalance = api.currentBalance;
      this.pastPaymentsTotal = api.pastPaymentsTotal;
      this.pastPayments = api.pastPayments.map(p => PastPaymentModel.fromApi(p));
      this.loading = false;
    });    
  }

  startPayment() {
    this.makingPayment = true;
    this.paymentNotes = '';
    this.paymentAmount = undefined;
    this.paymentAmountOptions = 'outstanding';
    this.paymentDateOptions = 'today';
    this.paymentDate = undefined;
  }

  cancelPayment() {
    this.makingPayment = false;
  }

  completePayment() {
    let amount = (this.currentBalance < 0 && this.paymentAmountOptions == 'outstanding') ? -this.currentBalance : this.paymentAmount;
    let date = this.paymentDateOptions == 'today' ? this.todaysDate : this.paymentDate;
    let notes = this.paymentNotes;

    this.service.makePayment(this.customer.id, {date: date.toString(), amount, notes}).subscribe(response => {
      this.pastPayments.unshift(PastPaymentModel.fromApi(response.newPastPayment));
      this.pastPaymentsTotal = response.newPastPaymentsTotal;
      this.currentBalance = response.newCurrentBalance;
      this.makingPayment = false;
    })
  }
  
  update(properties: {[property: string]: any}) {
    this.service.update(this.customer.id, properties).subscribe(() => {
      for(let p in properties) {
        this.customer[p] = properties[p];
      }
    });
  };
}

@Component({
  selector: 'cc-payments-page',
  templateUrl: 'app/customers/customer-page/payments-page.component.html',
  directives: [OrderComponent, ButtonComponent, NumberComponent, DateComponent, EditableSelectComponent, EditableTextAreaComponent, FORM_DIRECTIVES],
  pipes: [MoneyPipe, DateStringPipe, CountPipe, PreserveLinesPipe]
})
export class PaymentsPageComponent implements OnInit {
  model: PaymentsModel
  paymentDetailsValidators: Validators = Validators.compose([])
  
  paymentAmountControl: Control
  paymentDateControl: Control
  form: ControlGroup;
  paymentSubmitted = false;
  paymentAmountValidationMessage: string = '';
  paymentDateValidationMessage: string = '';
  paymentAmountMessages = {required: 'Amount must not be empty', zero: 'Amount must not be zero', notNumeric: 'Amount must be a number'};
  paymentDateMessages = {required: 'Date must not be empty', invalidDate: 'Date must be correctly entered', nonExistentDate: 'Date must be a date that actually exists', before1900: 'Date must at least be in the 20th century!'};

  constructor(
    private builder: FormBuilder,
    @Inject(forwardRef(() => CustomerPageService))
    private page: CustomerPageService,
    private customerService: CustomerService) {
    this.model = new PaymentsModel(this.page.customer, this.customerService);
  }

  ngOnInit() {
    this.paymentAmountControl = new Control('', Validators.compose([NumberComponent.isNotZero, this.paymentAmountMaybeRequired.bind(this)]))
    this.paymentDateControl = new Control('', Validators.compose([DateComponent.isValidDate, DateComponent.isAfter1900, this.paymentDateMaybeRequired.bind(this)]))

    this.form = this.builder.group({
      paymentAmount: this.paymentAmountControl,
      paymentDate: this.paymentDateControl
    })

    this.model.load();
  }

  setPaymentAmountValidationMessage() {
    if(!this.paymentSubmitted || this.paymentAmountControl.valid) {
      this.paymentAmountValidationMessage = '';
      return;
    }

    for(let e in this.paymentAmountControl.errors) {
      this.paymentAmountValidationMessage = this.paymentAmountMessages[e] ? this.paymentAmountMessages[e] : e;
      return;
    }
  }

  setPaymentDateValidationMessage() {
    if(!this.paymentSubmitted || this.paymentDateControl.valid) {
      this.paymentDateValidationMessage = '';
      return;
    }

    for(let e in this.paymentDateControl.errors) {
      this.paymentDateValidationMessage = this.paymentDateMessages[e] ? this.paymentDateMessages[e] : e;
      return;
    }
  }

  startPayment() {
    this.paymentSubmitted = false;
    this.model.startPayment();
  }

  completePayment() {
    this.paymentSubmitted = true;

    if(!this.form.valid) {
      if(!this.paymentAmountControl.valid) {
        this.setPaymentAmountValidationMessage();
      }

      if(!this.paymentDateControl.valid) {
        this.setPaymentDateValidationMessage();
      }

      return;
    }

    this.model.completePayment();
  }

  cancelPayment() {
    this.model.cancelPayment();
  }

  paymentAmountMaybeRequired(control: Control): ValidationResult {
    let required = !this.model.paymentAmountOptionsVisible || this.model.paymentAmountOptions == 'otherAmount';
    if(required && !control.value) {
      return {'required': true};
    }
 
    return null;
  }

  paymentDateMaybeRequired(control: Control): ValidationResult {
    let date = <DateString>control.value;
    if(this.model.paymentDateOptions == 'otherDate' && !date) {
      return {'required': true};
    }
 
    return null;
  }
}