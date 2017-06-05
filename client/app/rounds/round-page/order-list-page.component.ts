import { Component, OnInit, Input, Inject, forwardRef } from '@angular/core';
import { Round, RoundService, CustomerOrderList, CustomerOrder } from '../round.service'
import { ProductQuantity } from '../../products/product'
import { DateStringPipe, MoneyPipe } from '../../shared/pipes'; 
import { ProductQuantityComponent } from '../../products/product-quantity.component'
import { RoundPageService } from './round-page.component'
import { DeliveryPageService } from './delivery-page.component'
import { DateString, Dates } from '../../shared/dates'
import { ROUTER_DIRECTIVES } from '@angular/router-deprecated';
import { ButtonComponent } from '../../shared/button.component'
import { SectionHeaderComponent } from '../../structure/section-header.component'

@Component({
  selector: 'cc-order-list-page',
  templateUrl: 'app/rounds/round-page/order-list-page.component.html',
  styleUrls: ['app/rounds/round-page/order-list-page.component.css'],
  pipes: [MoneyPipe, DateStringPipe],
  directives: [ProductQuantityComponent, ROUTER_DIRECTIVES, ButtonComponent, SectionHeaderComponent]
})
export class OrderListPageComponent implements OnInit {
  constructor(private roundService: RoundService,
  @Inject(forwardRef(() => RoundPageService))
  private roundPage: RoundPageService) {
  }

  orderList: CustomerOrderList;
  nextDeliveryDate: DateString;

  ngOnInit() {
    this.roundService.getOrderList(this.roundPage.round.id)
                     .subscribe(o => { this.orderList = o; console.log(o); });

    // let startDate = this.roundPage.round.deliveries.length
    //   ? this.roundPage.round.deliveries[0].date
    //   : DateString.today().addDays(-1);
    
    // this.nextDeliveryDate = this.roundPage.round.nextDeliveryDate && this.roundPage.round.nextDeliveryDate.isOnOrAfter(DateString.today())? this.roundPage.round.nextDeliveryDate : this.getNextDeliveryDateAfter(startDate);
    this.nextDeliveryDate = this.roundPage.round.getNextDeliveryDate();
  }

  // getNextDeliveryDateAfter(startDateExclusive: DateString): DateString {
  //   return startDateExclusive.getNextDayOfWeek(this.roundPage.round.deliveryWeekday);
  // }

  exclude(o: CustomerOrder) {
    this.roundService.excludeCustomerFromNextDelivery(this.roundPage.round.id, o.id).subscribe(() => {
      o.excluded = true;
      this.orderList.totalCost = this.orderList.orders.reduce((s, o) => s + (o.excluded ? 0 : o.totalCost), 0);
    })
  }

  include(o: CustomerOrder) {
    this.roundService.includeCustomerInNextDelivery(this.roundPage.round.id, o.id).subscribe(() => {
      o.excluded = false;
      this.orderList.totalCost = this.orderList.orders.reduce((s, o) => s + (o.excluded ? 0 : o.totalCost), 0);
    })
  }
}