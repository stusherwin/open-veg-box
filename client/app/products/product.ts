export class Product {
  constructor(id: number, name:string, price:number, unitType: UnitType, unitQuantity: number) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.unitType = unitType;
    this.unitQuantity = unitQuantity
  }
    
  id: number;
  name: string;
  price: number;
  unitType: UnitType;
  unitQuantity: number;

  clone() {
    return new Product(this.id, this.name, this.price, this.unitType, this.unitQuantity);
  }
}

export class UnitType {
  value: string;
  name: string;

  constructor(value:string, name:string) {
    this.value = value;
    this.name = name;
  }

  public static All = {
    perKg: new UnitType( "perKg", "per Kg" ),
    each: new UnitType( "each", "each" )
  };
}