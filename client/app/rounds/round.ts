export class Round {
  constructor(id: number, name:string, customers: RoundCustomer[]) {
    this.id = id;
    this.name = name;
    this.customers = customers;
  }
    
  id: number;
  name: string;
  customers: RoundCustomer[]

  clone() {
    return new Round(this.id, this.name, this.customers.map(c => new RoundCustomer(c.id, c.name, c.address)));
  }
}

export class RoundCustomer {
  constructor(id: number, name:string, address: string) {
    this.id = id;
    this.name = name;
    this.address = address;
  }
    
  id: number;
  name: string;
  address: string;
}