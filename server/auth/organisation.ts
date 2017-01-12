import {Db} from '../shared/db'

export class Organisation {
  constructor(id: number, name:string, username:string, canSendEmails: boolean, db: Db) {
    this.id = id;
    this.name = name;
    this.username = username;
    this.canSendEmails = canSendEmails;
    this.db = db;
  }
    
  id: number;
  name: string;
  username: string;
  canSendEmails: boolean;
  db: Db;
}