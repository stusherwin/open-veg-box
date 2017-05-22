import { Component, OnInit, Input, Inject, forwardRef } from '@angular/core';
import { Round, RoundService, ProductList } from '../round.service'
import { ProductQuantity } from '../../products/product'
import { ProductQuantityComponent } from '../../products/product-quantity.component'
import { RoundPageService } from './round-page.component'

@Component({
  selector: 'cc-product-list-page',
  templateUrl: 'app/rounds/round-page/product-list-page.component.html',
  styleUrls: ['app/rounds/round-page/product-list-page.component.css'],
  directives: [ProductQuantityComponent]
})
export class ProductListPageComponent implements OnInit {
  constructor(private roundService: RoundService,
  @Inject(forwardRef(() => RoundPageService))
  private page: RoundPageService) {
  }

  productList: ProductList

  ngOnInit() {
    this.roundService.getProductList(this.page.round.id)
                     .subscribe(p => this.productList = p);
  }
}