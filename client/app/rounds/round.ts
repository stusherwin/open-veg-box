export class Round {
  constructor(
    public id: number,
    public name:string,
    public deliveryWeekday: number,
    public customers: RoundCustomer[]) {
  }

  clone() {
    return new Round(this.id, this.name, this.deliveryWeekday, this.customers.map(c => new RoundCustomer(c.id, c.name, c.address, c.email)));
  }
}

export class RoundCustomer {
  constructor(
    public id: number,
    public name:string,
    public address: string,
    public email: string) {
  }
}