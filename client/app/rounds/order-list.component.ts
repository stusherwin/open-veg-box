import { Component, OnInit, Input } from '@angular/core';
import { Round } from './round'
import { ProductQuantity } from '../products/product'
import { RoundService, CustomerOrderList } from './round.service'
import { RouteParams } from '@angular/router-deprecated';
import { MoneyPipe } from '../shared/pipes'; 
import { ProductQuantityComponent } from '../products/product-quantity.component'
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';

@Component({
  selector: 'cc-order-list',
  templateUrl: 'app/rounds/order-list.component.html',
  styleUrls: ['app/rounds/order-list.component.css'],
  pipes: [MoneyPipe],
  directives: [ProductQuantityComponent],
  providers: [RoundService]
})
export class OrderListComponent implements OnInit {
  constructor(private roundService: RoundService, private routeParams: RouteParams) {
  }

  round: Round;
  orderList: CustomerOrderList;

  ngOnInit() {
    let roundId = +this.routeParams.params['roundId'];

    Observable.combineLatest(
      this.roundService.get(roundId),
      this.roundService.getOrderList(roundId),
      (r, o) => ({r, o})
    ).subscribe(({r, o}) => {
      this.round = r;
      this.orderList = o;
    });
  }
}