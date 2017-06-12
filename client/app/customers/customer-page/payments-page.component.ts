import { Component, OnInit, Input, Output, Inject, forwardRef, ViewChildren, QueryList, EventEmitter, ViewChild, ElementRef, Renderer, ChangeDetectorRef } from '@angular/core';
import { CustomerModel } from './customer.model'
import { OrderComponent } from '../orders/order.component'
import { MoneyPipe, DateStringPipe, CountPipe, PreserveLinesPipe } from '../../shared/pipes'
import { Customer } from '../customer'
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
  paymentMethod = 'Invoice';
  paymentDetails = 'Some details go here...'
  paymentMethodOptions = ['Credit/debit card', 'Direct debit', 'Invoice'];

  constructor(private customerId: number, private service: CustomerService) {
  }

  load() {
    this.service.getPastPayments(this.customerId).subscribe(api => {
      this.currentBalance = api.currentBalance;
      this.pastPaymentsTotal = api.pastPaymentsTotal;
      this.pastPayments = api.pastPayments.map(p => PastPaymentModel.fromApi(p));
      this.loading = false;
    });    
  }

  startPayment() {
    this.makingPayment = true;
  }

  cancelPayment() {
    this.makingPayment = false;
  }

  completePayment() {
    let amount = (this.currentBalance < 0 && this.paymentAmountOptions == 'outstanding') ? -this.currentBalance : this.paymentAmount;
    let date = this.paymentDateOptions == 'today' ? this.todaysDate : this.paymentDate;
    let notes = this.paymentNotes;

    this.service.makePayment(this.customerId, {date: date.toString(), amount, notes}).subscribe(response => {
      this.pastPayments.unshift(PastPaymentModel.fromApi(response.newPastPayment));
      this.pastPaymentsTotal = response.newPastPaymentsTotal;
      this.currentBalance = response.newCurrentBalance;
      this.paymentNotes = '';
      this.paymentAmount = undefined;
      this.paymentAmountOptions = 'outstanding';
      this.paymentDateOptions = 'today';
      this.paymentDate = undefined;
      this.makingPayment = false;
    })
  }
}

@Component({
  selector: 'cc-payments-page',
  templateUrl: 'app/customers/customer-page/payments-page.component.html',
  directives: [OrderComponent, ButtonComponent, NumberComponent, DateComponent, EditableSelectComponent, EditableTextAreaComponent],
  pipes: [MoneyPipe, DateStringPipe, CountPipe, PreserveLinesPipe]
})
export class PaymentsPageComponent implements OnInit {
  model: PaymentsModel
  paymentAmountControl: Control
  paymentDateControl: Control
  paymentDetailsValidators: Validators = Validators.compose([])

  constructor(
    @Inject(forwardRef(() => CustomerPageService))
    private page: CustomerPageService,
    private customerService: CustomerService) {
  }

  ngOnInit() {
    this.paymentAmountControl = new Control('', Validators.compose([NumberComponent.isNumeric, NumberComponent.isGreaterThanZero]))
    this.paymentDateControl = new Control('', Validators.compose([NumberComponent.isNumeric, NumberComponent.isGreaterThanZero]))
    this.model = new PaymentsModel(this.page.customer.id, this.customerService);
    this.model.load();
  }
}