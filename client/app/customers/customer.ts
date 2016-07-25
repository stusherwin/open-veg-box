export class Customer {
  constructor(id: number, name:string) {
    this.id = id;
    this.name = name;
  }
    
  id: number;
  name: string;

  clone() {
    return new Customer(this.id, this.name);
  }
}