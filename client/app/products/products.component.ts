import { Component, OnInit, Input } from '@angular/core';
import { Product } from './product'
import { ProductService } from './product.service'
import { UsersService } from '../users/users.service'
import { ProductDisplayComponent } from './product-display.component'
import { Observable } from 'rxjs/Observable';
import { RouteParams } from '@angular/router-deprecated';
import { HighlightService } from '../shared/highlight.service';
import { HighlightableDirective } from '../shared/highlightable.directive';

@Component({
  selector: 'cc-products',
  templateUrl: 'app/products/products.component.html',
  directives: [ProductDisplayComponent, HighlightableDirective],
  providers: [ProductService, UsersService, HighlightService]
})
export class ProductsComponent implements OnInit {
  constructor(productService: ProductService, routeParams: RouteParams) {
    this.productService = productService;
    this.queryParams = routeParams.params;
  }

  productService: ProductService;
  products: Product[] = [];

  queryParams: {[key: string]: string};

  ngOnInit() {
    this.productService.getAll(this.queryParams).subscribe(p => {
      this.products = p;
    } );
  }

  add(product: Product) {
    console.log(product);
    this.productService.add(product, this.queryParams).subscribe(products => {
      this.products = products;
    });
  }

  delete(product: Product) {
    this.productService.delete(product.id, this.queryParams).subscribe(products => {
      this.products = products;
    });
  }
}