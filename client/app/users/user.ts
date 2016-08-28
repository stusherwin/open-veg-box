export class User {
  constructor(name: string, authToken:string) {
    this.name = name;
    this.authToken = authToken;
  }
    
  name: string;
  authToken: string;
}