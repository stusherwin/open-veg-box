import { Component, OnInit, Input, Inject, forwardRef } from '@angular/core';
import { RoundPageService } from './round-page.component'
import { EditableService } from '../../shared/editable.service'
import { Validators } from '@angular/common'
import { EditableSelectComponent } from '../../shared/editable-select.component'

export class Dates {
  static addDays(date: Date, days: number) {
    let newDate = new Date(date.valueOf());
    newDate.setDate(date.getDate() + days);
    return newDate;
  }

  static getDatePart(date: Date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  static max(a: Date, b: Date) {
    return Dates.getDatePart(a) > Dates.getDatePart(b) ? a : b;
  }

  static getNextDayOfWeekAfter(startDateExclusive: Date, dayOfWeek: number) {
    let nextDate = Dates.addDays(startDateExclusive, 1);

    if(nextDate.getDay() == dayOfWeek) {
      return nextDate;
    }

    let daysToAdd = dayOfWeek - nextDate.getDay();
    if(daysToAdd < 0) {
      daysToAdd += 7;
    }

    return Dates.addDays(nextDate, daysToAdd);    
  }
}

export class Delivery {
  constructor(public date: Date, public isComplete: boolean) {
  }
}

export class DeliveryWeekday { index: number; name: string }

export class DeliveriesModel {
  weekdayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  weekdays = [
    {index: 0, name: 'Sunday'}, 
    {index: 1, name: 'Monday'}, 
    {index: 2, name: 'Tuesday'}, 
    {index: 3, name: 'Wednesday'}, 
    {index: 4, name: 'Thursday'}, 
    {index: 5, name: 'Friday'}, 
    {index: 6, name: 'Saturday'}
  ];
  deliveryWeekday: DeliveryWeekday
  deliveries: DeliveryModel[]
  nextDeliveryDate: Date

  constructor(
    deliveryWeekday: number,
    deliveries: Delivery[]
  ) {
    this.deliveries = deliveries.map(d => new DeliveryModel(d.date, d.isComplete, this));
    this.deliveryWeekday = this.weekdays[deliveryWeekday];
    
    let startDate = this.deliveries.length
      ? this.deliveries[0].date
      : Dates.addDays(new Date(), -1);
    this.nextDeliveryDate = this.getNextDeliveryDateAfter(startDate)
  }

  get canCreateNewDelivery() {
    return !this.deliveries.length || this.deliveries[0].isComplete;
  }

  newDelivery() {
    this.deliveries.unshift(new DeliveryModel(this.nextDeliveryDate, false, this));
    this.nextDeliveryDate = this.getNextDeliveryDateAfter(this.nextDeliveryDate)
  }

  canComplete(delivery: DeliveryModel) {
    return !delivery.isComplete;
  }

  canUncomplete(delivery: DeliveryModel) {
    return delivery.isComplete && delivery == this.deliveries[0];
  }

  complete(delivery: DeliveryModel) {
    delivery.isComplete = true;
    let startDate = this.deliveries.length
      ? this.deliveries[0].date
      : Dates.addDays(new Date(), -1);
    this.nextDeliveryDate = this.getNextDeliveryDateAfter(startDate)
  }

  uncomplete(delivery: DeliveryModel) {
    delivery.isComplete = false;
  }

  get canDecNextDeliveryDate() {
    let dec = this.getNextDeliveryDateAfter(Dates.addDays(this.nextDeliveryDate, -8))
    return !this.deliveries.length || Dates.getDatePart(dec) > Dates.getDatePart(this.deliveries[0].date);
  }

  decNextDeliveryDate() {
    this.nextDeliveryDate = this.getNextDeliveryDateAfter(Dates.addDays(this.nextDeliveryDate, -8));
  }

  incNextDeliveryDate() {
    this.nextDeliveryDate = this.getNextDeliveryDateAfter(this.nextDeliveryDate);
  }

  getNextDeliveryDateAfter(startDateExclusive: Date) {
    return Dates.getNextDayOfWeekAfter(startDateExclusive, this.deliveryWeekday.index);
  }

  updateDeliveryWeekday(weekday: DeliveryWeekday) {
    this.deliveryWeekday = weekday;

    let startDate = this.ensureAtLeast(this.deliveries[0], Dates.addDays(this.nextDeliveryDate, -7));
    this.nextDeliveryDate = this.getNextDeliveryDateAfter(startDate);
  }

  canDecDeliveryDate(delivery: DeliveryModel) {
    if(delivery != this.deliveries[0] || delivery.isComplete) {
      return false;
    }

    let dec = this.getNextDeliveryDateAfter(Dates.addDays(delivery.date, -8))
    return this.deliveries.length == 1 || Dates.getDatePart(dec) > Dates.getDatePart(this.deliveries[1].date);
  }

  canIncDeliveryDate(delivery: DeliveryModel) {
    return delivery == this.deliveries[0] && !delivery.isComplete;
  }

  decDeliveryDate(delivery: DeliveryModel) {
    let startDate = this.ensureAtLeast(this.deliveries[1], Dates.addDays(delivery.date, -8));
    delivery.date = this.getNextDeliveryDateAfter(startDate);

    startDate = this.ensureAtLeast(this.deliveries[0], Dates.addDays(this.nextDeliveryDate, -7));
    this.nextDeliveryDate = this.getNextDeliveryDateAfter(startDate);
  }

  incDeliveryDate(delivery: DeliveryModel) {
    delivery.date = this.getNextDeliveryDateAfter(delivery.date);

    let startDate = this.ensureAtLeast(this.deliveries[0], Dates.addDays(this.nextDeliveryDate, -7));
    this.nextDeliveryDate = this.getNextDeliveryDateAfter(startDate);
  }

  private ensureAtLeast(delivery: DeliveryModel, date: Date) {
    if(!delivery) {
      return date;
    }

    return Dates.max(date, delivery.date);
  }
}

export class DeliveryModel {
  constructor(
    public date: Date,
    public isComplete: boolean,
    private deliveries: DeliveriesModel) {
  }

  get canComplete() {
    return this.deliveries.canComplete(this);
  }

  get canUncomplete() {
    return this.deliveries.canUncomplete(this);
  }

  complete() {
    this.deliveries.complete(this);
  }

  uncomplete() {
    this.deliveries.uncomplete(this);
  }

  get canDecDeliveryDate() {
    return this.deliveries.canDecDeliveryDate(this);
  }

  get canIncDeliveryDate() {
    return this.deliveries.canIncDeliveryDate(this);
  }

  decDeliveryDate() {
    this.deliveries.decDeliveryDate(this);
  }

  incDeliveryDate() {
    this.deliveries.incDeliveryDate(this);
  }
}

@Component({
  selector: 'cc-deliveries-page',
  templateUrl: 'app/rounds/round-page/deliveries-page.component.html',
  directives: [EditableSelectComponent],
  providers: [EditableService]
})
export class RoundDeliveriesPageComponent {
  model: DeliveriesModel

  constructor(
    @Inject(forwardRef(() => RoundPageService))
    private page: RoundPageService) {
      let date = new Date();
      let deliveries: Delivery[] = [];
      for(let i = 0; i < 10; i++) {
        date.setDate(date.getDate() - 7)
        deliveries.push(new Delivery(new Date(date.valueOf()), i != 0))
      }

      this.model = new DeliveriesModel(1, deliveries)
  }
  
  x(v: any) {
    console.log(v)
  }
}