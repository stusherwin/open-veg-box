export class Round {
  constructor(
    public id: number, 
    public name:string, 
    public deliveryWeekday: number,
    public customers: RoundCustomer[]) {
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