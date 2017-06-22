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
}

export class CustomerWithOrder extends Customer {
  constructor(id: number, firstName:string, surname: string, address: string, tel1: string, tel2: string, email: string, paymentMethod: string, paymentDetails: string, order: Order, collectionPointId: number) {
    super(id, firstName, surname, address, tel1, tel2, email, paymentMethod, paymentDetails);
    this.order = order;
    this.collectionPointId = collectionPointId;
  }

  order: Order;
  collectionPointId: number;
}

export class Order {
  constructor(
    public id: number, 
    public customerId: number, 
    public boxes: OrderItem[], 
    public extraProducts: OrderItem[], 
    public discounts: OrderDiscount[],
    public total: number) {
  }
}

export class OrderItem {
  constructor( 
    public id: number, 
    public name: string, 
    public price: number, 
    public quantity: number, 
    public unitType: string, 
    public total: number) {
  }
}

export class OrderDiscount {
  constructor(
    public id: number,
    public name: string,
    public total: number) {
  }
}