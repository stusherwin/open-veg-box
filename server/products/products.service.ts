import {Product} from './product'

const defaultPageSize: number = 10;

export class ProductsService {

  private products: Product[] = [
    new Product(1, 'Carrots', 1.2, "perKg", 0.5),
    new Product(2, 'Garlic (bulb) 1', 0.7, "each", 1),
    new Product(3, 'Garlic (bulb) 2', 0.7, "each", 1),
    new Product(4, 'Garlic (bulb) 3', 0.7, "each", 1),
    new Product(5, 'Garlic (bulb) 4', 0.7, "each", 1),
    new Product(6, 'Garlic (bulb) 5', 0.7, "each", 1),
    new Product(7, 'Garlic (bulb) 6', 0.7, "each", 1),
    new Product(8, 'Garlic (bulb) 7', 0.7, "each", 1),
    new Product(9, 'Garlic (bulb) 8', 0.7, "each", 1),
    new Product(10, 'Garlic (bulb) 9', 0.7, "each", 1),
    new Product(11, 'Garlic (bulb) 10', 0.7, "each", 1),
    new Product(12, 'Garlic (bulb) 11', 0.7, "each", 1)
  ];

  private updateProperty(dest: any, source: any, propertyName: string) {
    if(Object.getOwnPropertyNames(source).indexOf(propertyName) >= 0) {
      dest[propertyName] = source[propertyName];
    }
  }

  getAll(queryParams: any): Product[] {
    console.log(queryParams);
    var pageSize = +(queryParams.pageSize || defaultPageSize);
    var startIndex = (+(queryParams.page || 1) - 1) * pageSize;
    var endIndex = startIndex + pageSize;

    return this.products.slice(startIndex, endIndex); 
  }

  add(params: any, queryParams: any): Product[] {
    var id = this.products.map(p => p.id).reduce((m, c) => c > m ? c : m, 0) + 1;
    var product = new Product(id, params.name, params.price, params.unitType, params.unitQuantity);
    this.products.splice(0, 0, product);

    return this.getAll(queryParams);
  }

  update(id: number, params: any, queryParams: any): Product[] {
    var product = this.products.find(p => p.id == id);
    if(product == null) {
      return null;
    }

    this.updateProperty(product, params, 'name');
    this.updateProperty(product, params, 'price');
    this.updateProperty(product, params, 'unitType');
    this.updateProperty(product, params, 'unitQuantity');

    return this.getAll(queryParams);
  }
}