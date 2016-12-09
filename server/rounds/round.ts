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
  constructor(id: number, name:string, address: string, email: string) {
    this.id = id;
    this.name = name;
    this.address = address;
    this.email = email;
  }
    
  id: number;
  name: string;
  address: string;
  email: string;
}