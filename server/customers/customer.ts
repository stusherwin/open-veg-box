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
  constructor(id: number, firstName:string, surname: string, address: string, tel1: string, tel2: string, email: string, paymentMethod: string, paymentDetails: string, order: Order) {
    super(id, firstName, surname, address, tel1, tel2, email, paymentMethod, paymentDetails);
    this.order = order;
  }

  order: Order;
}

export class Order {
  constructor(id: number, customerId: number, boxes: OrderItem[], extraProducts: OrderItem[], total: number) {
    this.id = id;
    this.customerId = customerId;
    this.boxes = boxes;
    this.extraProducts = extraProducts;
    this.total = total;
  }

  id: number;
  customerId: number;
  boxes: OrderItem[];
  extraProducts: OrderItem[];
  total: number;
}

export class OrderItem {
  constructor(id: number, name: string, price: number, quantity: number, unitType: string, total: number) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.quantity = quantity;
    this.unitType = unitType;
    this.total = total;
  }

  id: number;
  name: string;
  price: number;
  quantity: number;
  unitType: string;
  total: number;
}