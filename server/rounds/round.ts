export class Round {
  constructor(id: number, name:string, customers: RoundCustomer[]) {
    this.id = id;
    this.name = name;
    this.customers = customers;
  }
    
  id: number;
  name: string;
  customers: RoundCustomer[]
}

export class RoundCustomer {
  constructor(id: number, name:string) {
    this.id = id;
    this.name = name;
  }
    
  id: number;
  name: string;
}