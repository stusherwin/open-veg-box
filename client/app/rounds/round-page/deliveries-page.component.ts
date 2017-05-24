import { Component, OnInit, Input, Inject, forwardRef } from '@angular/core';
import { RoundPageService } from './round-page.component'
import { EditableService } from '../../shared/editable.service'
import { Validators } from '@angular/common'
import { EditableSelectComponent } from '../../shared/editable-select.component'
import { Round, Delivery, RoundService } from '../round.service'
import { ButtonComponent } from '../../shared/button.component'
import { Dates } from '../../shared/dates'
import { ROUTER_DIRECTIVES } from '@angular/router-deprecated';
import { Arrays } from '../../shared/arrays'
import { MoneyPipe } from '../../shared/pipes'

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
  nextDeliveryDate: Date;
  orderCount: number = 0;
  orderTotal: number = 0;

  constructor(
    private round: Round,
    private service: RoundService
  ) {
    this.deliveries = round.deliveries.map(d => new DeliveryModel(d.id, d.date, d.orderCount, d.orderTotal, this));
    this.deliveryWeekday = this.weekdays[round.deliveryWeekday];
    
    let startDate = this.deliveries.length
      ? this.deliveries[0].date
      : Dates.addDays(new Date(), -1);
    this.nextDeliveryDate = round.nextDeliveryDate && round.nextDeliveryDate >= new Date() ? round.nextDeliveryDate : this.getNextDeliveryDateAfter(startDate);
    this.service.getOrderList(round.id).subscribe(ol =>{
      this.orderCount = ol.orders.filter(o => !o.excluded).length;
      this.orderTotal = ol.totalCost;
    })
  }

  newDelivery() {
    this.service.update(this.round.id, {nextDeliveryDate: this.nextDeliveryDate}).subscribe(() => {
      this.service.createDelivery(this.round.id).subscribe(result => {
        this.deliveries.unshift(new DeliveryModel(result.id, this.nextDeliveryDate, result.orderCount, result.orderTotal, this));
        this.round.deliveries.unshift(new Delivery(result.id, this.nextDeliveryDate, result.orderCount, result.orderTotal));
        let nextDeliveryDate = this.getNextDeliveryDateAfter(this.nextDeliveryDate);
        this.updateNextDeliveryDate(nextDeliveryDate);
      });
    });
  }

  canUncomplete(delivery: DeliveryModel) {
    return delivery == this.deliveries[0];
  }

  uncomplete(delivery: DeliveryModel) { 
    this.service.cancelDelivery(this.round.id, delivery.id).subscribe(() => {
      Arrays.remove(this.deliveries, delivery);
      Arrays.removeWhere(this.round.deliveries, d => d.id == delivery.id);
      let startDate = this.deliveries.length
        ? this.deliveries[0].date
        : Dates.addDays(new Date(), -1);
      let nextDeliveryDate = this.getNextDeliveryDateAfter(startDate);
      this.updateNextDeliveryDate(nextDeliveryDate);
    });
  }

  get canDecNextDeliveryDate() {
    let dec = this.getNextDeliveryDateAfter(Dates.addDays(this.nextDeliveryDate, -8))
    return !this.deliveries.length || Dates.getDatePart(dec) > Dates.getDatePart(this.deliveries[0].date);
  }

  decNextDeliveryDate() {
    let nextDeliveryDate = this.getNextDeliveryDateAfter(Dates.addDays(this.nextDeliveryDate, -8));
    this.updateNextDeliveryDate(nextDeliveryDate);    
  }

  incNextDeliveryDate() {
    let nextDeliveryDate = this.getNextDeliveryDateAfter(this.nextDeliveryDate);
    this.updateNextDeliveryDate(nextDeliveryDate);
  }

  getNextDeliveryDateAfter(startDateExclusive: Date) {
    return Dates.getNextDayOfWeekAfter(startDateExclusive, this.deliveryWeekday.index);
  }

  updateDeliveryWeekday(weekday: DeliveryWeekday) {
    this.service.update(this.round.id, {deliveryWeekday: weekday.index}).subscribe(() => {
      this.deliveryWeekday = weekday;
      this.round.deliveryWeekday = weekday.index;

      let startDate = this.ensureAtLeast(this.deliveries[0], Dates.addDays(this.nextDeliveryDate, -7));
      let nextDeliveryDate = this.getNextDeliveryDateAfter(startDate);
      this.updateNextDeliveryDate(nextDeliveryDate);
    });
  }

  updateNextDeliveryDate(date: Date) {
    this.service.update(this.round.id, {nextDeliveryDate: date}).subscribe(() => {
      this.nextDeliveryDate = date;
    });
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
    public id: number,
    public date: Date,
    public orderCount: number,
    public orderTotal: number,
    private deliveries: DeliveriesModel) {
  }

  get canUncomplete() {
    return this.deliveries.canUncomplete(this);
  }

  uncomplete() {
    this.deliveries.uncomplete(this);
  }
}

@Component({
  selector: 'cc-deliveries-page',
  templateUrl: 'app/rounds/round-page/deliveries-page.component.html',
  directives: [EditableSelectComponent, ButtonComponent, ROUTER_DIRECTIVES],
  pipes: [MoneyPipe],
  providers: [/*EditableService*/]
})
export class RoundDeliveriesPageComponent {
  model: DeliveriesModel

  constructor(
    @Inject(forwardRef(() => RoundPageService))
    private page: RoundPageService,
    private service: RoundService) {
      this.model = new DeliveriesModel(page.round, service)
  }
}