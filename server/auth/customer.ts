export class Customer {
  constructor(id: number, name:string, username:string, password: string, db: string) {
    this.id = id;
    this.name = name;
    this.username = username;
    this.password = password;
    this.db = db;
  }
    
  id: number;
  name: string;
  username: string;
  password: string;
  db: string;
}