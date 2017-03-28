import { Component, OnInit, Input } from '@angular/core';
import { Round } from './round'
import { ProductQuantity } from '../products/product'
import { RoundService, ProductList } from './round.service'
import { RouteParams } from '@angular/router-deprecated';
import { ProductQuantityComponent } from '../products/product-quantity.component'
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';

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
  productList: ProductList

  ngOnInit() {
    let roundId = +this.routeParams.params['roundId'];
    Observable.combineLatest(
      this.roundService.get(roundId),
      this.roundService.getProductList(roundId),
      (r, p) => ({r, p})
    ).subscribe(({r, p}) => {
      this.round = r;
      this.productList = p;
    });
  }
}