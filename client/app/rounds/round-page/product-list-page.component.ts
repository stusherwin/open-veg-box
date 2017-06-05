import { Component, OnInit, Input, Inject, forwardRef } from '@angular/core';
import { Round, RoundService, ProductList } from '../round.service'
import { ProductQuantity } from '../../products/product'
import { ProductQuantityComponent } from '../../products/product-quantity.component'
import { RoundPageService } from './round-page.component'
import { DeliveryPageService } from './delivery-page.component'
import { DateString, Dates } from '../../shared/dates'
import { ROUTER_DIRECTIVES } from '@angular/router-deprecated';
import { ButtonComponent } from '../../shared/button.component'
import { DateStringPipe } from '../../shared/pipes';
import { SectionHeaderComponent } from '../../structure/section-header.component'

@Component({
  selector: 'cc-product-list-page',
  templateUrl: 'app/rounds/round-page/product-list-page.component.html',
  styleUrls: ['app/rounds/round-page/product-list-page.component.css'],
  directives: [ProductQuantityComponent, ROUTER_DIRECTIVES, ButtonComponent, SectionHeaderComponent],
  pipes: [DateStringPipe]
})
export class ProductListPageComponent implements OnInit {
  constructor(private roundService: RoundService,
  @Inject(forwardRef(() => RoundPageService))
  private roundPage: RoundPageService) {
  }

  productList: ProductList
  nextDeliveryDate: DateString;

  ngOnInit() {
    this.roundService.getProductList(this.roundPage.round.id)
                     .subscribe(p => this.productList = p);

    // let startDate = this.roundPage.round.deliveries.length
    //   ? this.roundPage.round.deliveries[0].date
    //   : DateString.today().addDays(-1);
    
    // this.nextDeliveryDate = this.roundPage.round.nextDeliveryDate && this.roundPage.round.nextDeliveryDate.isOnOrAfter(DateString.today()) ? this.roundPage.round.nextDeliveryDate : this.getNextDeliveryDateAfter(startDate);
    this.nextDeliveryDate = this.roundPage.round.getNextDeliveryDate();
  }

  // getNextDeliveryDateAfter(startDateExclusive: DateString): DateString {
  //   return startDateExclusive.getNextDayOfWeek(this.roundPage.round.deliveryWeekday);
  // }
}