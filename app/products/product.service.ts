import { Product, UnitType } from './product'
import { Injectable } from '@angular/core';

@Injectable()
export class ProductService {
  products: Product[] = [
    new Product(1, 'Carrots', 1.2, UnitType.All.perKg, 0.5),
    new Product(2, 'Garlic (bulb)', 0.7, UnitType.All.each, 1)
  ];

  getAll() {
    return Promise.resolve(this.products);
  }

  add(product: Product) {
    product.id = this.products.map(p => p.id).reduce((m, c, i, a) => c > m ? c : m, 0) + 1;
    product.price = parseFloat('' + product.price);
    product.unitQuantity = parseFloat('' + product.unitQuantity);
    this.products.splice(0, 0, product);
  }

  save(product: Product) {
    var origIdx = this.products.findIndex(p => p.id == product.id);
    product.price = parseFloat('' + product.price);
    product.unitQuantity = parseFloat('' + product.unitQuantity);
    this.products.splice(origIdx, 1, product);
  }
}