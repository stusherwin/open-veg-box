import { Component, OnInit, Input } from '@angular/core';
import { Product, UnitType } from './product'
import { ProductService } from './product.service'
import { UsersService } from '../users/users.service'
import { ProductDisplayComponent } from './product-display.component'
import { ProductEditComponent } from './product-edit.component'
import { Observable } from 'rxjs/Observable';
import { RouteParams } from '@angular/router-deprecated';

@Component({
  selector: 'cc-products',
  styleUrls: ['app/products/products.component.css'],
  templateUrl: 'app/products/products.component.html',
  directives: [ProductDisplayComponent, ProductEditComponent],
  providers: [ProductService, UsersService]
})
export class ProductsComponent implements OnInit {
  private adding: Product;
  private editing: Product;

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

  startAdd() {
    this.adding = new Product(0, 'New product', 1.0, "each", 1);
  }

  startEdit(product: Product) {
    this.editing = product.clone();
  }

  completeAdd() {
    this.productService.add(this.adding, this.queryParams).subscribe(products => {
      this.adding = null;
      this.products = products;
    });
  }

  completeEdit() {
    this.productService.update(this.editing.id, this.editing, this.queryParams).subscribe(products => {
      this.editing = null;
      this.products = products;
    });
  }
  
  delete(product: Product) {
    this.productService.delete(product.id, this.queryParams).subscribe(products => {
      this.editing = null;
      this.products = products;
    });
  }

  cancel() {
    this.editing = null;
    this.adding = null;
  }
}