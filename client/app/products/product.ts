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
  justAdded: boolean;

  clone() {
    return new Product(this.id, this.name, this.price, this.unitType, this.unitQuantity);
  }
}

export class UnitType {
  constructor(name: string, value: string) {
    this.name = name;
    this.value = value;
  }

  name: string;
  value: string;
}

export let unitTypes: UnitType[] = [
  new UnitType("per Kg", "perKg"),
  new UnitType("each", "each")
];