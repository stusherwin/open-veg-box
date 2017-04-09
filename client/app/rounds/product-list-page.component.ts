import { Component, OnInit, Input, Inject, forwardRef } from '@angular/core';
import { Round } from './round'
import { ProductQuantity } from '../products/product'
import { RoundService, ProductList } from './round.service'
import { ProductQuantityComponent } from '../products/product-quantity.component'
import { RoundPageService } from './round-page.component'

@Component({
  selector: 'cc-product-list-page',
  templateUrl: 'app/rounds/product-list-page.component.html',
  styleUrls: ['app/rounds/product-list-page.component.css'],
  directives: [ProductQuantityComponent]
})
export class ProductListPageComponent implements OnInit {
  constructor(private roundService: RoundService,
  @Inject(forwardRef(() => RoundPageService))
  private roundPageService: RoundPageService) {
  }

  productList: ProductList

  ngOnInit() {
    this.roundService.getProductList(this.roundPageService.round.id)
                     .subscribe(p => this.productList = p);
  }
}