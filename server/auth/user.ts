export class User {
  constructor(username: string, organisation:string) {
    this.username = username;
    this.organisation = organisation;
  }
    
  username: string;
  organisation: string;
}