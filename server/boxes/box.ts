import {ProductQuantity} from '../products/product'

export class Box {
  constructor(id: number, name:string, price: number) {
    this.id = id;
    this.name = name;
    this.price = price;
  }
    
  id: number;
  name: string;
  price: number;

  clone() {
    return new Box(this.id, this.name, this.price);
  }
}

export class BoxWithProducts extends Box {
  constructor(id: number, name:string, price: number, products: ProductQuantity[]) {
    super(id, name, price);
    this.products = products;
  }
    
  products: ProductQuantity[]

  clone() {
    return new BoxWithProducts(this.id, this.name, this.price, this.products.map(p => new ProductQuantity(p.id, p.name, p.quantity, p.unitType)));
  }
}