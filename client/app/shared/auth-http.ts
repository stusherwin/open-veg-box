import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { RouteConfig, Router, ROUTER_DIRECTIVES } from '@angular/router-deprecated';

export class AuthHttp {
  http: Http;
  router: Router;

  constructor(http: Http, router: Router) {
    this.http = http;
    this.router = router;
  }

  
}