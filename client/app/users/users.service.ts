import { User } from './user'
import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';

@Injectable()
export class UsersService {
  http: Http;

  constructor(http: Http) {
    this.http = http;
  }

  getCurrentUser(): User {
    return this.getUser();
  }

  private getUser(): User {
    if (!localStorage.length) {
      return null;
    }

    var user = new User(localStorage.getItem('username'), localStorage.getItem('password'), localStorage.getItem('customerName'));
    return user;
  }

  private saveUser(username: string, password: string, customerName: string) {
    localStorage.setItem('username', username);
    localStorage.setItem('password', password);
    localStorage.setItem('customerName', customerName);
  }

  private clearUser() {
    localStorage.clear();
  }

  login(username: string, password: string): void {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    let params = {username: username, password: password};
    this.http.post('api/auth/login', JSON.stringify(params), options)
             .map(res => res.json())
             .subscribe(u => this.saveUser(username, password, u.customerName));
  }

  logout(): void {
    this.clearUser();
    // let headers = new Headers({ 'Content-Type': 'application/json' });
    // let options = new RequestOptions({ headers: headers });
    // let params = {username: 'bad', password: 'credentials'};
    // var obs = this.http.post('api/auth/login', JSON.stringify(params), options)
    //                    .map(this.hydrate);
    // obs.subscribe(u => this.saveUser(u));
    // let headers = new Headers({ 'Content-Type': 'application/json' });
    // let options = new RequestOptions({ headers: headers });
    // var user = this.getUser();
    // var obs = this.http.post('api/auth/logout', JSON.stringify({}), options)
    //                    .map(r => true);
    // obs.subscribe(u => this.clearUser());
  }

  // private hydrate(res: Response): User {
  //   if (!res.text()) {
  //     return null;
  //   }

  //   var user = res.json();
  //   return user? new User(user.customerName, user.authToken) : null;
  // }
}