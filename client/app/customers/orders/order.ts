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