import { Component, OnInit, Input, Inject, forwardRef } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router-deprecated';
import { Round } from './round'
import { ProductQuantity } from '../products/product'
import { RoundService, ProductList } from './round.service'
import { RouteParams } from '@angular/router-deprecated';
import { ProductQuantityComponent } from '../products/product-quantity.component'
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';
import { RoundPageHeaderComponent } from './round-page-header.component'
import { RoundSectionService } from './round-section.component'

@Component({
  selector: 'cc-product-list-page',
  templateUrl: 'app/rounds/product-list-page.component.html',
  styleUrls: ['app/rounds/product-list-page.component.css'],
  directives: [ProductQuantityComponent, ROUTER_DIRECTIVES, RoundPageHeaderComponent]
})
export class ProductListPageComponent implements OnInit {
  constructor(private roundService: RoundService,
  @Inject(forwardRef(() => RoundSectionService))
  private roundSectionService: RoundSectionService) {
  }

  productList: ProductList

  ngOnInit() {
    this.roundService.getProductList(this.roundSectionService.round.id)
                     .subscribe(p => this.productList = p);
  }
}