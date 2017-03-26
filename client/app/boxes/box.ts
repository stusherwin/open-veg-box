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
  constructor(id: number, name:string, price: number, products: BoxProduct[]) {
    super(id, name, price);
    this.products = products;
  }
    
  products: BoxProduct[]

  clone() {
    return new BoxWithProducts(this.id, this.name, this.price, this.products.map(p => new BoxProduct(p.id, p.name, p.quantity, p.unitType)));
  }
}

export class BoxProduct {
  constructor(id: number, name:string, quantity: number, unitType: string) {
    this.id = id;
    this.name = name;
    this.quantity = quantity;
    this.unitType = unitType;
  }
    
  id: number;
  name: string;
  quantity: number;
  unitType: string;

  clone() {
    return new BoxProduct(this.id, this.name, this.quantity, this.unitType);
  }
}