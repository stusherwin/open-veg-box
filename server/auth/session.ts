export class Session {
  constructor(authToken: string, customerName:string) {
    this.authToken = authToken;
    this.customerName = customerName;
  }
    
  authToken: string;
  customerName: string;
}