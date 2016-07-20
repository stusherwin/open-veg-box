import {Product} from './product'

export class ProductsService {
  products: Product[] = [
    new Product(1, 'Carrots', 1.2, "perKg", 0.5),
    new Product(2, 'Garlic (bulb)', 0.7, "each", 1)
  ];

  getAll() {
    return this.products; 
  }

  get(id: number) {
    return this.products.find(p => p.id == id);
  }
  
  add(product: Product): Product {
    product.id = this.products.map(p => p.id).reduce((m, c, i, a) => c > m ? c : m, 0) + 1;
    product.price = parseFloat('' + product.price);
    product.unitQuantity = parseFloat('' + product.unitQuantity);
    this.products.splice(0, 0, product);

    return product;
  }

  update(id: number, product: Product): Product {
    var origIdx = this.products.findIndex(p => p.id == id);
    if( origIdx < 0 ) {
      return null;
    }

    product.price = parseFloat('' + product.price);
    product.unitQuantity = parseFloat('' + product.unitQuantity);
    this.products.splice(origIdx, 1, product);
    return product;
  }
}