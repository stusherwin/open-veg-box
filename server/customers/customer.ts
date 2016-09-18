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
}