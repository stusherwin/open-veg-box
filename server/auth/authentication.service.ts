import {Customer} from './customer'
import {User} from './user'
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/fromPromise'
import 'rxjs/add/observable/of';
import * as path from 'path';

let customers: Customer[] = [
  new Customer(1, 'Guest', 'guest', '', 'guest'),
  new Customer(2, 'Umbel Organics', 'umbel', 'password', 'umbel')
];

var sqlite = require('sqlite3').verbose();
var databases: { [username: string]: any; } = {};

for(var c of customers) {
  databases[c.username] = new sqlite.Database(path.resolve(__dirname, '../', c.db + '.sqlite'));
}

export class AuthenticationService {
  getDb(username: string) {
    return databases[username];    
  }

  login(username: string, password: string): Observable<User> {
    let customer = customers.find(c => c.username === username && c.password === password);
    if (customer != null) {
      return Observable.of(new User(customer.username, customer.name));
    }
    return Observable.throw('not found');
  }

  // logout(token: string): Observable<boolean> {
  //   return Observable.of(true);
  // }
}