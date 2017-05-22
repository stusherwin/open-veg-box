export class Round {
  constructor(
    public id: number, 
    public name:string, 
    public deliveryWeekday: number,
    public customers: RoundCustomer[],
    public deliveries: Delivery[]) {
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

export class Delivery {
  constructor(
    public id: number,
    public date: Date,
    public isComplete: boolean
  ) {
  }
}