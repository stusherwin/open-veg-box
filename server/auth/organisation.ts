export class Organisation {
  constructor(id: number, name:string, username:string, password: string, dbName: string) {
    this.id = id;
    this.name = name;
    this.username = username;
    this.password = password;
    this.dbName = dbName;
  }
    
  id: number;
  name: string;
  username: string;
  password: string;
  dbName: string;
}