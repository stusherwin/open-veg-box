export class Organisation {
  constructor(id: number, name:string, username:string, canSendEmails: boolean, dbType: string, dbConfig: string) {
    this.id = id;
    this.name = name;
    this.username = username;
    this.canSendEmails = canSendEmails;
    this.dbType = dbType;
    this.dbConfig = dbConfig;
  }
    
  id: number;
  name: string;
  username: string;
  canSendEmails: boolean;
  dbType: string;
  dbConfig: string;
}