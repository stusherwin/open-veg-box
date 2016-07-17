import {Product, UnitType} from './product'

export class ProductsService {
  products: Product[] = [
    new Product(1, 'Carrots', 1.2, UnitType.All.perKg, 0.5),
    new Product(2, 'Garlic (bulb)', 0.7, UnitType.All.each, 1)
  ];

  getAll() {
    return this.products;
  }

  get(id: number) {
    return this.products.find(p => p.id == id);
  }
}