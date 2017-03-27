import { Component, OnInit, Input } from '@angular/core';
import { Round } from './round'
import { ProductQuantity } from '../products/product'
import { RoundService } from './round.service'
import { RouteParams } from '@angular/router-deprecated';

@Component({
  selector: 'cc-order-list',
  templateUrl: 'app/rounds/order-list.component.html',
  styleUrls: ['app/rounds/order-list.component.css'],
  providers: [RoundService]
})
export class OrderListComponent implements OnInit {
  constructor(private roundService: RoundService, private routeParams: RouteParams) {
  }

  round: Round;

  ngOnInit() {
    let roundId = +this.routeParams.params['roundId'];
    this.roundService.get(roundId).combineLatest(
        this.roundService.getProductList(roundId),
        (round, products) => ({ round, products }))
      .subscribe(({round, products}) => {
      this.round = round;
    });
  }
}