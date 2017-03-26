export class Product {
  constructor(id: number, name:string, price:number, unitType: string, unitQuantity: number) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.unitType = unitType;
    this.unitQuantity = unitQuantity
  }
    
  id: number;
  name: string;
  price: number;
  unitType: string;
  unitQuantity: number;
}

export class ProductQuantity {
  constructor(id: number, name: string, quantity: number, unitType: string) {
    this.id = id;
    this.name = name;
    this.quantity = quantity;
    this.unitType = unitType;
  }
    
  id: number;
  name: string;
  quantity: number;
  unitType: string;
}