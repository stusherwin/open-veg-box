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
  constructor(id: number, customerId: number, items: CustomerOrderItem[]) {
    this.id = id;
    this.customerId = customerId;
    this.items = items;
  }

  id: number;
  customerId: number;
  items: CustomerOrderItem[];
}

export class CustomerOrderItem {
  constructor(type: string, id: number, name: string, quantity: number, unitType: string) {
    this.type = type;
    this.id = id;
    this.name = name;
    this.quantity = quantity;
    this.unitType = unitType;
  }

  type: string;
  id: number;
  name: string;
  quantity: number;
  unitType: string;
}