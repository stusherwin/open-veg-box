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

    var user = new User(localStorage.getItem('name'), localStorage.getItem('authToken'));
    return user;
  }

  private saveUser(user: User) {
    localStorage.setItem('name', user.name);
    localStorage.setItem('authToken', user.authToken);
  }

  private clearUser() {
    localStorage.clear();
  }

  login(username: string, password: string): void {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    let params = {username: username, password: password};
    var obs = this.http.post('api/auth/login', JSON.stringify(params), options)
                       .map(this.hydrate);
    obs.subscribe(u => this.saveUser(u));
  }

  logout(): void {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    var user = this.getUser();
    var obs = this.http.post('api/auth/logout/' + user.authToken, JSON.stringify({}), options)
                       .map(r => true);
    obs.subscribe(u => this.clearUser());
  }

  private hydrate(res: Response): User {
    if (!res.text()) {
      return null;
    }

    var user = res.json();
    return user? new User(user.customerName, user.authToken) : null;
  }
}