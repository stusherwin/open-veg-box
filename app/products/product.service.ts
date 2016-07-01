import { Product } from './product'
import { Injectable } from '@angular/core';

@Injectable()
export class ProductService {
  products: Product[] = [
    new Product(1, 'Carrots', 1.2),
    new Product(2, 'Garlic (bulb)', 0.7)
  ];

  getAll() {
    return Promise.resolve(this.products);
  }

  add(product: Product) {
    product.id = this.products.map(p => p.id).reduce((m, c, i, a) => c > m ? c : m, 0) + 1;
    this.products.splice(0, 0, product);
  }

  save(product: Product) {
    var origIdx = this.products.findIndex(p => p.id == product.id);
    this.products.splice(origIdx, 1, product);
  }
}