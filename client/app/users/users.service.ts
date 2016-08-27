import { User } from './user'
import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/map';

@Injectable()
export class UsersService {
  http: Http;

  constructor(http: Http) {
    this.http = http;
  }

  currentUser: User;

  getCurrent(): Observable<User> {
    return this.http.get('/api/users/current')
                    .map(this.hydrate);
  }

  login(username: string, password: string): Observable<User> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    let params = {username: username, password: password};
    return this.http.post('api/users/login', JSON.stringify(params), options)
                    .map(this.hydrate);
  }

  logout(): Observable<User> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this.http.post('api/users/logout', JSON.stringify({}), options)
                    .map(this.hydrate);
  }

  private hydrate(res: Response): User {
    console.log(res);
    console.log(res.text());
    if (!res.text()) {
      return null;
    }

    var user = res.json();
    console.log(user);
    return user? new User(user.username, user.name) : null;
  }
}