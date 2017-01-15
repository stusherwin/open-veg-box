import { Component, OnInit, Input } from '@angular/core';
import { Product } from './product'
import { ProductService } from './product.service'
import { UsersService } from '../users/users.service'
import { ProductComponent } from './product.component'
import { Observable } from 'rxjs/Observable';
import { RouteParams } from '@angular/router-deprecated';
import { FocusService } from '../shared/focus.service';
import { FocusDirective } from '../shared/focus.directive';

@Component({
  selector: 'cc-products',
  templateUrl: 'app/products/products.component.html',
  directives: [ProductComponent, FocusDirective],
  providers: [ProductService, UsersService, FocusService]
})
export class ProductsComponent implements OnInit {
  constructor(productService: ProductService, routeParams: RouteParams) {
    this.productService = productService;
    this.queryParams = routeParams.params;
  }

  productService: ProductService;
  products: Product[] = [];
  loaded: boolean;

  queryParams: {[key: string]: string};

  ngOnInit() {
    this.productService.getAll(this.queryParams).subscribe(p => {
      this.loaded = true;
      this.products = p;
    } );
  }

  onAdd(product: Product) {
    this.productService.add(product, this.queryParams).subscribe(products => {
      this.products = products;
    });
  }

  onDelete(product: Product) {
    this.productService.delete(product.id, this.queryParams).subscribe(products => {
      this.products = products;
    });
  }

  onUpdate(product: Product) {
    this.productService.update(product.id, product, this.queryParams).subscribe(products => {});
  }
}