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