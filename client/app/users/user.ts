export class User {
  constructor(username: string, password: string, customerName:string) {
    this.username = username;
    this.password = password;
    this.customerName = customerName;
  }
    
  username: string;
  password: string;
  customerName: string;
}