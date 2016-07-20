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