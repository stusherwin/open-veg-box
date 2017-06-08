import { Component, OnInit, Input, Output, Inject, forwardRef, ViewChildren, QueryList, EventEmitter, ViewChild, ElementRef, Renderer, ChangeDetectorRef } from '@angular/core';
import { CustomerModel } from './customer.model'
import { OrderComponent } from '../orders/order.component'
import { MoneyPipe, DateStringPipe, CountPipe } from '../../shared/pipes'
import { Customer } from '../customer'
import { CustomerPageService } from './customer-page.component'
import { CustomerService } from '../customer.service'
import { DateString } from '../../shared/dates'
import { ButtonComponent } from '../../shared/button.component'
import { ProductQuantityComponent } from '../../products/product-quantity.component'
import { NumberComponent } from '../../shared/input.component'
import { Control, Validators, FORM_DIRECTIVES, FormBuilder, ControlGroup } from '@angular/common'


// import { ApiPastPayments, ApiPastPayment } from '../customer.service'
export class ApiPastPayment {
  date: string;
  amount: number;
}

export class ApiPastPayments {
  outstandingBalance: number;
  pastPaymentsTotal: number;
  pastPayments: ApiPastPayment[];
}

export class PastPaymentModel {
  date: DateString
  amount: number

  constructor(api: ApiPastPayment) {
    this.date = DateString.fromJSONString(api.date);
    this.amount = api.amount;
  }
}

export class PastPaymentsModel {
  outstandingBalance: number;
  pastPaymentsTotal: number;
  pastPayments: PastPaymentModel[] = []
  paymentDateOptions: string = 'today'
  paymentAmountOptions: string = 'full'
  paymentAmount: number = 0;
  paymentDateYear: number
  paymentDateMonth: number
  paymentDateDay: number
  todaysDate: DateString = DateString.fromDate(new Date());
  loading = true;

  get paymentDate(): DateString {
    if(!this.paymentDateYear || !this.paymentDateMonth || !this.paymentDateDay) {
      return null;
    }
    
    return new DateString(this.paymentDateYear, this.paymentDateMonth, this.paymentDateDay);
  }

  load(api: ApiPastPayments) {
    this.outstandingBalance = api.outstandingBalance;
    this.pastPaymentsTotal = api.pastPaymentsTotal;
    this.pastPayments = api.pastPayments.map(p => new PastPaymentModel(p));
    this.loading = false;
  }

  pay() {
    let amount = this.paymentAmountOptions == 'full' ? this.outstandingBalance : this.paymentAmount;
    let date = this.paymentDateOptions == 'today' ? this.todaysDate : this.paymentDate;
    this.pastPayments.unshift({date, amount});
    this.pastPaymentsTotal = this.pastPayments.reduce((t,p) => t + p.amount, 0);
    this.outstandingBalance -= amount;
  }
}

@Component({
  selector: 'cc-payments-page',
  templateUrl: 'app/customers/customer-page/payments-page.component.html',
  directives: [OrderComponent, ButtonComponent, NumberComponent],
  pipes: [MoneyPipe, DateStringPipe, CountPipe]
})
export class PaymentsPageComponent implements OnInit {
  model: PastPaymentsModel
  paymentAmountControl: Control
  paymentDateDayControl: Control
  paymentDateMonthControl: Control
  paymentDateYearControl: Control

  constructor(
    @Inject(forwardRef(() => CustomerPageService))
    private page: CustomerPageService,
    private customerService: CustomerService) {
  }

  ngOnInit() {
    this.paymentAmountControl = new Control('', Validators.compose([NumberComponent.isNumeric, NumberComponent.isGreaterThanZero]))
    this.paymentDateDayControl = new Control('', Validators.compose([NumberComponent.isNumeric, NumberComponent.isGreaterThanZero]))
    this.paymentDateMonthControl = new Control('', Validators.compose([NumberComponent.isNumeric, NumberComponent.isGreaterThanZero]))
    this.paymentDateYearControl = new Control('', Validators.compose([NumberComponent.isNumeric, NumberComponent.isGreaterThanZero]))
    this.model = new PastPaymentsModel();
    this.model.load({
      outstandingBalance: 123,
      pastPaymentsTotal: 100,
      pastPayments: [
        {date: '2017-06-01T00:00:00.000Z', amount: 10},
        {date: '2017-05-25T00:00:00.000Z', amount: 12.5}
      ]
    })
  }
}