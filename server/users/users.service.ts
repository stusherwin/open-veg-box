import {User} from './user'
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/fromPromise'

export class UsersService {
  private users: User[] = [
    new User(1, 'Guest', 'guest', ''),
    new User(2, 'Stu', 'stu', 'password')
  ];

  private currentUser: User = null;

  getCurrent(): Observable<User> {
    return Observable.of(this.currentUser);
  }

  login(params: any): Observable<User> {
    this.currentUser = this.users.find(u => u.username === params.username && u.password === params.password);

    return this.getCurrent();
  }

  logout(): Observable<User> {
    this.currentUser = null;
    
    return this.getCurrent();
  }
}