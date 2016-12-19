import {bootstrap} from '@angular/platform-browser-dynamic';
import {AppComponent} from './app.component';
import {ROUTER_PROVIDERS, Router} from '@angular/router-deprecated';
import {HTTP_PROVIDERS, Http, Request, RequestOptionsArgs, Response, XHRBackend, RequestOptions, ConnectionBackend, Headers} from '@angular/http';
import {provide} from '@angular/core';
import {AuthHttp, NonAuthHttp} from './auth/auth-http';
import {UsersService} from './users/users.service';
import {ErrorService} from './shared/error.service'

bootstrap(AppComponent, [
  ROUTER_PROVIDERS,
  HTTP_PROVIDERS,
  UsersService,
  ErrorService,
  provide(Http, {
    useFactory: (xhrBackend: XHRBackend, requestOptions: RequestOptions, router: Router, usersService: UsersService, errorService: ErrorService) => new AuthHttp(xhrBackend, requestOptions, router, usersService, errorService),
    deps: [XHRBackend, RequestOptions, Router, UsersService, ErrorService]
  }),
  provide(NonAuthHttp, {
    useFactory: (xhrBackend: XHRBackend, requestOptions: RequestOptions, errorService: ErrorService) => new NonAuthHttp(xhrBackend, requestOptions, errorService),
    deps: [XHRBackend, RequestOptions, ErrorService]
  })
]).catch(err => console.log(err));
