import { Component, OnInit, Input, Inject, forwardRef } from '@angular/core';
import { Round, RoundService, ProductList } from '../round.service'
import { ProductQuantity } from '../../products/product'
import { ProductQuantityComponent } from '../../products/product-quantity.component'
import { RoundPageService } from './round-page.component'
import { DeliveryPageService } from './delivery-page.component'

@Component({
  selector: 'cc-product-list-page',
  templateUrl: 'app/rounds/round-page/product-list-page.component.html',
  styleUrls: ['app/rounds/round-page/product-list-page.component.css'],
  directives: [ProductQuantityComponent]
})
export class ProductListPageComponent implements OnInit {
  constructor(private roundService: RoundService,
  @Inject(forwardRef(() => RoundPageService))
  private roundPage: RoundPageService,
  @Inject(forwardRef(() => DeliveryPageService))
  private page: DeliveryPageService) {
  }

  productList: ProductList

  ngOnInit() {
    this.roundService.getProductList(this.roundPage.round.id, this.page.delivery.id)
                     .subscribe(p => this.productList = p);
  }
}