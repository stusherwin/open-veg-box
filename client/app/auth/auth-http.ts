import {Http, Request, RequestOptionsArgs, Response, RequestOptions, ConnectionBackend, Headers} from '@angular/http';
import {Router} from '@angular/router-deprecated';
import {Observable} from 'rxjs/Observable';
import {UsersService} from '../users/users.service'
import {ErrorService} from '../shared/error.service'

export class AuthHttp extends Http {
  constructor(backend: ConnectionBackend, defaultOptions: RequestOptions, private _router: Router, private _usersService: UsersService, private _errorService: ErrorService) {
    super(backend, defaultOptions);
  }
  
  request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
    return this._intercept(super.request(url, this._getRequestOptionArgs(options)));
  }
  
  get(url: string, options?: RequestOptionsArgs): Observable<Response> {
    return this._intercept(super.get(url, this._getRequestOptionArgs(options)));
  }
  
  post(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
    return this._intercept(super.post(url, body, this._getRequestOptionArgs(options)));
  }
  
  put(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
    return this._intercept(super.put(url, body, this._getRequestOptionArgs(options)));
  }
  
  delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
    return this._intercept(super.delete(url, this._getRequestOptionArgs(options)));
  }
  
  private _getRequestOptionArgs(options?: RequestOptionsArgs) : RequestOptionsArgs {
    options = options || new RequestOptions();
    options.headers = options.headers || new Headers();
    options.headers.append('Authorization', 'X-Basic ' + this._usersService.getAuthToken());
    return options;
  }
  
  private _intercept(obs: Observable<Response>): Observable<Response> {
    return obs.catch((err, source) => {
      if (err.status == 401) {
        this._router.navigate(['Login']);
        return Observable.empty();
      } else {
        this._errorService.raiseError(err);
        return Observable.throw(err);
      }
    });
  }
}

export class NonAuthHttp extends Http {
  constructor(backend: ConnectionBackend, defaultOptions: RequestOptions, private _errorService: ErrorService) {
    super(backend, defaultOptions);
  }
  
  request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
    return this._intercept(super.request(url, options));
  }
  
  get(url: string, options?: RequestOptionsArgs): Observable<Response> {
    return this._intercept(super.get(url, options));
  }
  
  post(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
    return this._intercept(super.post(url, body, options));
  }
  
  put(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
    return this._intercept(super.put(url, body, options));
  }
  
  delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
    return this._intercept(super.delete(url, options));
  }
  
  private _intercept(obs: Observable<Response>): Observable<Response> {
    return obs.catch((err, source) => {
      if (err.status == 401) {
        return Observable.throw(err);
      } else {
        this._errorService.raiseError(err);
        return Observable.throw(err);
      }
    });
  }
}