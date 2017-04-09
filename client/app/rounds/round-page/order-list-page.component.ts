import { Component, OnInit, Input, Inject, forwardRef } from '@angular/core';
import { Round } from '../round'
import { ProductQuantity } from '../../products/product'
import { RoundService, CustomerOrderList } from '../round.service'
import { MoneyPipe } from '../../shared/pipes'; 
import { ProductQuantityComponent } from '../../products/product-quantity.component'
import { RoundPageService } from './round-page.component'

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
  private roundPageService: RoundPageService) {
  }

  orderList: CustomerOrderList;

  ngOnInit() {
      this.roundService.getOrderList(this.roundPageService.round.id)
                       .subscribe(o => this.orderList = o);
  }
}