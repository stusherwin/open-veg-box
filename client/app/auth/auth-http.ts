import {Http, Request, RequestOptionsArgs, Response, RequestOptions, ConnectionBackend, Headers} from '@angular/http';
import {Router} from '@angular/router-deprecated';
import {Observable} from 'rxjs/Observable';
import {UsersService} from '../users/users.service'

export class AuthHttp extends Http {
  constructor(backend: ConnectionBackend, defaultOptions: RequestOptions, private _router: Router, private _usersService: UsersService) {
    super(backend, defaultOptions);
  }
  
  request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
    return this.intercept(super.request(url, options));
  }
  
  get(url: string, options?: RequestOptionsArgs): Observable<Response> {
    return this.intercept(super.get(url,this.getRequestOptionArgs(options)));
  }
  
  post(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
    return this.intercept(super.post(url, body, this.getRequestOptionArgs(options)));
  }
  
  put(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
    return this.intercept(super.put(url, body, this.getRequestOptionArgs(options)));
  }
  
  delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
    return this.intercept(super.delete(url, options));
  }
  
  getRequestOptionArgs(options?: RequestOptionsArgs) : RequestOptionsArgs {
    options = options || new RequestOptions();
    options.headers = options.headers || new Headers();
    options.headers.append('Authorization', 'X-Basic ' + this._usersService.getAuthToken());
    return options;
  }
  
  intercept(observable: Observable<Response>): Observable<Response> {
    return observable.catch((err, source) => {
      if (err.status == 401) {
        this._router.navigate(['Login']);
        return Observable.empty();
      } else {
        return Observable.throw(err);
      }
    });
  }
}

export class NonAuthHttp extends Http {
  constructor(backend: ConnectionBackend, defaultOptions: RequestOptions) {
    super(backend, defaultOptions);
  }
}