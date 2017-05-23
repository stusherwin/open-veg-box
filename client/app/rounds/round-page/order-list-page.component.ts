import { Component, OnInit, Input, Inject, forwardRef } from '@angular/core';
import { Round, RoundService, CustomerOrderList } from '../round.service'
import { ProductQuantity } from '../../products/product'
import { MoneyPipe } from '../../shared/pipes'; 
import { ProductQuantityComponent } from '../../products/product-quantity.component'
import { RoundPageService } from './round-page.component'
import { DeliveryPageService } from './delivery-page.component'

@Component({
  selector: 'cc-order-list-page',
  templateUrl: 'app/rounds/round-page/order-list-page.component.html',
  styleUrls: ['app/rounds/round-page/order-list-page.component.css'],
  pipes: [MoneyPipe],
  directives: [ProductQuantityComponent]
})
export class OrderListPageComponent implements OnInit {
  constructor(private roundService: RoundService,
  @Inject(forwardRef(() => RoundPageService))
  private roundPage: RoundPageService,
  @Inject(forwardRef(() => DeliveryPageService))
  private page: DeliveryPageService) {
  }

  orderList: CustomerOrderList;

  ngOnInit() {
      this.roundService.getOrderList(this.roundPage.round.id, this.page.delivery.id)
                       .subscribe(o => this.orderList = o);
  }
}