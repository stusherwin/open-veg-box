import { Component, OnInit, Input, Inject, forwardRef } from '@angular/core';
import { RoundPageService } from './round-page.component'
import { EditableService } from '../../shared/editable.service'
import { Validators } from '@angular/common'
import { EditableSelectComponent } from '../../shared/editable-select.component'
import { Round, Delivery, RoundService } from '../round.service'
import { ButtonComponent } from '../../shared/button.component'
import { DateString, Dates } from '../../shared/dates'
import { ROUTER_DIRECTIVES } from '@angular/router-deprecated';
import { Arrays } from '../../shared/arrays'
import { DateStringPipe, MoneyPipe } from '../../shared/pipes'

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

  get nextDeliveryDate() {
    return this.round.getNextDeliveryDate();
  }

  orderCount: number = 0;
  orderTotal: number = 0;

  constructor(
    private round: Round,
    private service: RoundService
  ) {
    this.deliveries = round.deliveries.map(d => new DeliveryModel(d.id, d.date, d.orderCount, d.orderTotal, this));
    this.deliveryWeekday = this.weekdays[round.deliveryWeekday];
    
    this.service.getOrderList(round.id).subscribe(ol =>{
      this.orderCount = ol.orders.filter(o => !o.excluded).length;
      this.orderTotal = ol.totalCost;
    })
  }

  newDelivery() {
    this.service.updateNextDeliveryDate(this.round.id, this.nextDeliveryDate).subscribe(() => {
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
      let nextDeliveryDate: DateString = null;

      if(this.deliveries.length) {
        nextDeliveryDate = this.getNextDeliveryDateAfter(this.deliveries[0].date);
      }

      this.updateNextDeliveryDate(nextDeliveryDate);
    });
  }

  get canDecNextDeliveryDate() {
    let dec = this.getNextDeliveryDateAfter(this.nextDeliveryDate.addDays(-8))
    return !this.deliveries.length || dec.isAfter(this.deliveries[0].date);
  }

  decNextDeliveryDate() {
    let nextDeliveryDate = this.getNextDeliveryDateAfter(this.nextDeliveryDate.addDays(-8));
    this.updateNextDeliveryDate(nextDeliveryDate);    
  }

  incNextDeliveryDate() {
    let nextDeliveryDate = this.getNextDeliveryDateAfter(this.nextDeliveryDate);
    this.updateNextDeliveryDate(nextDeliveryDate);
  }

  getNextDeliveryDateAfter(startDateExclusive: DateString): DateString {
    return startDateExclusive.getNextDayOfWeek(this.deliveryWeekday.index);
  }

  updateDeliveryWeekday(weekday: DeliveryWeekday) {
    this.service.update(this.round.id, {deliveryWeekday: weekday.index}).subscribe(() => {
      this.deliveryWeekday = weekday;
      this.round.deliveryWeekday = weekday.index;
      if(this.round.nextDeliveryDate) {
        let nextDeliveryDate = this.getNextDeliveryDateAfter(this.round.nextDeliveryDate.addDays(-1))
        this.updateNextDeliveryDate(nextDeliveryDate);
      }
    });
  }

  updateNextDeliveryDate(date: DateString) {
    this.service.updateNextDeliveryDate(this.round.id, date).subscribe(() => {
      this.round.nextDeliveryDate = date;
    });
  }

  private ensureAtLeast(delivery: DeliveryModel, date: DateString) {
    if(!delivery) {
      return date;
    }

    return DateString.max(date, delivery.date);
  }
}

export class DeliveryModel {
  constructor(
    public id: number,
    public date: DateString,
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
  pipes: [MoneyPipe, DateStringPipe],
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