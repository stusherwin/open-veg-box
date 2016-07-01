export class Product {
  constructor(id: number, name:string, price:number) {
    this.id = id;
    this.name = name;
    this.price = price;
  }
    
  id: number;
  name: string;
  price: number;

  clone() {
    return new Product(this.id, this.name, this.price);
  }
}