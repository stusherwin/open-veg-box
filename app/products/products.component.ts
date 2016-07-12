import { Component, OnInit } from '@angular/core';
import { Product, UnitType } from './product'
import { ProductService } from './product.service'
import { ProductDisplayComponent } from './product-display.component'
import { ProductEditComponent } from './product-edit.component'

@Component({
  selector: 'cc-products',
  styleUrls: ['app/products/products.component.css'],
  templateUrl: 'app/products/products.component.html',
  directives: [ProductDisplayComponent, ProductEditComponent],
  providers: [ProductService]
})
export class ProductsComponent implements OnInit {
  private adding: Product;
  private editing: Product;

  constructor(productService: ProductService) {
    this.productService = productService;
  }

  productService: ProductService;
  products: Product[] = [];

  private reload() {
    this.productService.getAll().then(p => this.products = p);
  }

  ngOnInit() {
    this.reload();
  }

  startAdd() {
    this.adding = new Product(0, 'New product', 1.0, UnitType.All.each, 1);
  }

  startEdit(product: Product) {
    this.editing = product.clone();
  }

  completeAdd() {
    this.productService.add(this.adding);
    this.adding = null;
    this.reload();
  }

  completeEdit() {
    this.productService.save(this.editing);
    this.editing = null;
    this.reload();
  }

  cancel() {
    this.editing = null;
    this.adding = null;
  }
}