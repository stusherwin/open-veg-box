import { Order } from './orders/order' 

export class Customer {
  constructor(id: number, firstName:string, surname: string, address: string, tel1: string, tel2: string, email: string) {
    this.id = id;
    this.firstName = firstName;
    this.surname = surname;
    this.address = address;
    this.tel1 = tel1;
    this.tel2 = tel2;
    this.email = email;
  }
    
  id: number;
  firstName: string;
  surname: string;
  address: string;
  tel1: string;
  tel2: string;
  email: string;

  get name() {
    return this.firstName + ' ' + this.surname;
  }

  clone() {
    return new Customer(this.id, this.firstName, this.surname, this.address, this.tel1, this.tel2, this.email);
  }
}

export class CustomerWithOrder extends Customer {
  constructor(id: number, firstName:string, surname: string, address: string, tel1: string, tel2: string, email: string, order: Order) {
    super(id, firstName, surname, address, tel1, tel2, email);
    this.order = order;
  }

  order: Order;
}