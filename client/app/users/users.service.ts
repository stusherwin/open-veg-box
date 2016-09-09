import { User } from './user'
import { Injectable } from '@angular/core';
import { Response, Headers, RequestOptions } from '@angular/http';
import { NonAuthHttp } from '../auth/auth-http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';

@Injectable()
export class UsersService {
  http: NonAuthHttp;

  constructor(http: NonAuthHttp) {
    this.http = http;
  }

  isLoggedIn(): boolean {
    return this.getUser() != null;
  }

  getCurrentUser(): User {
    return this.getUser();
  }

  getAuthToken(): string {
    var user = this.getUser();
    return user == null? '' : window.btoa(user.username + ':' + user.password);
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

  login(username: string, password: string): Observable<boolean> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    let params = {username: username, password: password};
    let obs = this.http.post('api/auth/login', JSON.stringify(params), options);

    obs.map(res => res.json())
       .subscribe(u => this.saveUser(username, password, u.customerName));

    return obs.map(_ => true);
  }

  logout(): Observable<boolean> {
    this.clearUser();

    return Observable.of(true);
  }
}