import {bootstrap} from '@angular/platform-browser-dynamic';
import {AppComponent} from './app.component';
import {ROUTER_PROVIDERS, Router} from '@angular/router-deprecated';
import {HTTP_PROVIDERS, Http, Request, RequestOptionsArgs, Response, XHRBackend, RequestOptions, ConnectionBackend, Headers} from '@angular/http';
import {provide} from '@angular/core';
import {AuthHttp, NonAuthHttp} from './auth/auth-http';
import {UsersService} from './users/users.service';

bootstrap(AppComponent, [
  ROUTER_PROVIDERS,
  HTTP_PROVIDERS,
  UsersService,
  provide(Http, {
    useFactory: (xhrBackend: XHRBackend, requestOptions: RequestOptions, router: Router, usersService: UsersService) => new AuthHttp(xhrBackend, requestOptions, router, usersService),
    deps: [XHRBackend, RequestOptions, Router, UsersService]
  }),
  provide(NonAuthHttp, {
    useFactory: (xhrBackend: XHRBackend, requestOptions: RequestOptions) => new NonAuthHttp(xhrBackend, requestOptions),
    deps: [XHRBackend, RequestOptions]
  })
]).catch(err => console.log(err));
