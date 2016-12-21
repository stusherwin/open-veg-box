export class Organisation {
  constructor(id: number, name:string, username:string, password: string, dbName: string, canSendEmails: boolean, isPostGres: boolean) {
    this.id = id;
    this.name = name;
    this.username = username;
    this.password = password;
    this.dbName = dbName;
    this.canSendEmails = canSendEmails;
    this.isPostGres = isPostGres;
  }
    
  id: number;
  name: string;
  username: string;
  password: string;
  dbName: string;
  canSendEmails: boolean;
  isPostGres: boolean;
}