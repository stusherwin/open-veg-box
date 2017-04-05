import { Component, OnInit, Input, Inject, forwardRef } from '@angular/core';
import { Round } from './round'
import { ProductQuantity } from '../products/product'
import { RoundService, CustomerOrderList } from './round.service'
import { MoneyPipe } from '../shared/pipes'; 
import { ProductQuantityComponent } from '../products/product-quantity.component'
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';
import { RoundSectionService } from './round-section.component'

@Component({
  selector: 'cc-order-list-page',
  templateUrl: 'app/rounds/order-list-page.component.html',
  styleUrls: ['app/rounds/order-list-page.component.css'],
  pipes: [MoneyPipe],
  directives: [ProductQuantityComponent]
})
export class OrderListPageComponent implements OnInit {
  constructor(private roundService: RoundService,
  @Inject(forwardRef(() => RoundSectionService))
  private roundSectionService: RoundSectionService) {
  }

  orderList: CustomerOrderList;

  ngOnInit() {
      this.roundService.getOrderList(this.roundSectionService.round.id)
                       .subscribe(o => this.orderList = o);
  }
}