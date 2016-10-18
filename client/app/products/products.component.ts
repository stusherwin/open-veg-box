import { Component, OnInit, Input } from '@angular/core';
import { Product } from './product'
import { ProductService } from './product.service'
import { UsersService } from '../users/users.service'
import { ProductDisplayComponent } from './product-display.component'
import { Observable } from 'rxjs/Observable';
import { RouteParams } from '@angular/router-deprecated';

@Component({
  selector: 'cc-products',
  templateUrl: 'app/products/products.component.html',
  directives: [ProductDisplayComponent],
  providers: [ProductService, UsersService]
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
    this.productService.add(product, this.queryParams).subscribe(products => {
      this.products = products;
      this.products[this.products.length-1].justAdded = true;
    });
  }

  delete(product: Product) {
    this.productService.delete(product.id, this.queryParams).subscribe(products => {
      this.products = products;
    });
  }
}