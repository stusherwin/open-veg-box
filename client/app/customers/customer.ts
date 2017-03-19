export class Customer {
  constructor(id: number, name:string, address: string, tel1: string, tel2: string, email: string) {
    this.id = id;
    this.name = name;
    this.address = address;
    this.tel1 = tel1;
    this.tel2 = tel2;
    this.email = email;
  }
    
  id: number;
  name: string;
  address: string;
  tel1: string;
  tel2: string;
  email: string;

  clone() {
    return new Customer(this.id, this.name, this.address, this.tel1, this.tel2, this.email);
  }
}

export class CustomerWithOrder extends Customer {
  constructor(id: number, name:string, address: string, tel1: string, tel2: string, email: string, order: CustomerOrder) {
    super(id, name, address, tel1, tel2, email);
    this.order = order;
  }

  order: CustomerOrder;
}

export class CustomerOrder {
  constructor(id: number, customerId: number, boxes: CustomerOrderItem[], additionalProducts: CustomerOrderItem[], total: number) {
    this.id = id;
    this.customerId = customerId;
    this.boxes = boxes;
    this.additionalProducts = additionalProducts;
    this.total = total;
  }

  id: number;
  customerId: number;
  boxes: CustomerOrderItem[];
  additionalProducts: CustomerOrderItem[];
  total: number;
}

export class CustomerOrderItem {
  constructor(id: number, name: string, quantity: number, unitType: string, total: number) {
    this.id = id;
    this.name = name;
    this.quantity = quantity;
    this.unitType = unitType;
    this.total = total;
  }

  id: number;
  name: string;
  quantity: number;
  unitType: string;
  total: number;
}