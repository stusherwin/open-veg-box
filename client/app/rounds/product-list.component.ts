import { Component, OnInit, Input } from '@angular/core';
import { Round } from './round'
import { ProductQuantity } from '../products/product'
import { RoundService } from './round.service'
import { RouteParams } from '@angular/router-deprecated';
import { ProductQuantityComponent } from '../products/product-quantity.component'

@Component({
  selector: 'cc-product-list',
  templateUrl: 'app/rounds/product-list.component.html',
  styleUrls: ['app/rounds/product-list.component.css'],
  directives: [ProductQuantityComponent],
  providers: [RoundService]
})
export class ProductListComponent implements OnInit {
  constructor(private roundService: RoundService, private routeParams: RouteParams) {
  }

  round: Round;
  products: ProductQuantity[]

  ngOnInit() {
    let roundId = +this.routeParams.params['roundId'];
    this.roundService.get(roundId).combineLatest(
        this.roundService.getProductList(roundId),
        (round, products) => ({ round, products }))
      .subscribe(({round, products}) => {
      this.round = round;
      this.products = products;
    });
  }
}