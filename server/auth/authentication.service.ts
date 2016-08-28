import {Customer} from './customer'
import {Session} from './session'
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/fromPromise'
import 'rxjs/add/observable/of';

function newGuid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
    return v.toString(16);
  });
}

export class AuthenticationService {
  private customers: Customer[] = [
    new Customer(1, 'Guest', 'guest', '', 'guest'),
    new Customer(2, 'Umbel Organics', 'umbel', 'password', 'umbel')
  ];

  private sessions: { [token: string]: Customer; } = {
  }

  login(params: any): Observable<Session> {
    let customer = this.customers.find(c => c.username === params.username && c.password === params.password);
    if (customer != null) {
      let token = newGuid();
      this.sessions[token] = customer; 
      return Observable.of(new Session(token, customer.name));
    }
    return Observable.throw('not found');
  }

  logout(token: string): Observable<boolean> {
    delete this.sessions[token];
    return Observable.of(true);
  }
}