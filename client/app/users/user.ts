export class User {
  constructor(username: string, password: string, organisation:string) {
    this.username = username;
    this.password = password;
    this.organisation = organisation;
  }
    
  username: string;
  password: string;
  organisation: string;
}