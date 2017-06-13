import { Order } from './orders/order' 

export class Customer {
  constructor(
    public id: number, 
    public firstName:string, 
    public surname: string,
    public address: string,
    public tel1: string,
    public tel2: string,
    public email: string, 
    public paymentMethod: string,
    public paymentDetails: string) {
  }

  get name() {
    return this.firstName + ' ' + this.surname;
  }

  clone() {
    return new Customer(
      this.id,
      this.firstName,
      this.surname,
      this.address,
      this.tel1,
      this.tel2,
      this.email,
      this.paymentMethod,
      this.paymentDetails);
  }
}

export class CustomerWithOrder extends Customer {
  constructor(
    id: number,
    firstName:string,
    surname: string,
    address: string,
    tel1: string,
    tel2: string,
    email: string,
    paymentMethod: string,
    paymentDetails: string,
    order: Order) {
    super(id, firstName, surname, address, tel1, tel2, email, paymentMethod, paymentDetails);
    this.order = order;
  }

  order: Order;
}

export class PaymentMethod {
  constructor(public value: string, public name: string) {
  }
}

export let paymentMethods: PaymentMethod[] = [
  new PaymentMethod('card', 'Credit/Debit card'),
  new PaymentMethod('directDebit', 'Direct debit'),
  new PaymentMethod('cash', 'Cash'),
  new PaymentMethod('other', 'Other')
];