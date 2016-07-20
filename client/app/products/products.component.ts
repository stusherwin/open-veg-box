import { Component, OnInit } from '@angular/core';
import { Product, UnitType } from './product'
import { ProductService } from './product.service'
import { ProductDisplayComponent } from './product-display.component'
import { ProductEditComponent } from './product-edit.component'
import { Observable } from 'rxjs/Observable';

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

  ngOnInit() {
    this.productService.getAll().subscribe(p => {
      console.log(p);
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
    this.productService.add(this.adding).subscribe(added => {
      this.adding = null;
      this.products.splice(0, 0, added);
    });
  }

  completeEdit() {
    this.productService.save(this.editing).subscribe(edited => {
      var index = this.products.findIndex(p => p.id === this.editing.id);
      this.editing = null;
      this.products.splice(index, 1, edited);
    });
  }

  cancel() {
    this.editing = null;
    this.adding = null;
  }
}