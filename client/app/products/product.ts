export class UnitPrice {
  constructor(public price: number, public unitType: string) {
  }

  clone() {
    return new UnitPrice(this.price, this.unitType);
  }
}

export class Product {
  constructor(
    public id: number,
    public name:string,
    public unitPrice:UnitPrice) {
  }

  clone() {
    return new Product(this.id, this.name, this.unitPrice);
  }
}

export class UnitType {
  constructor(public name: string, public value: string) {
  }
}

export let unitTypes: UnitType[] = [
  new UnitType("per Kg", "perKg"),
  new UnitType("each", "each")
];

export class ProductQuantity {
  constructor(
    public id: number,
    public name:string,
    public quantity: number,
    public unitType: string) {
  }

  clone() {
    return new ProductQuantity(this.id, this.name, this.quantity, this.unitType);
  }
}