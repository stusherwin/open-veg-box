import { Product } from './product'
import { Injectable, Inject } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { UsersService } from '../users/users.service'
import { Router } from '@angular/router-deprecated';

import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/empty';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

const paramsWhiteList = { p: 'page', ps: 'pageSize' };

@Injectable()
export class ProductService {
  private http: Http;
  private usersService: UsersService;
  private router: Router;

  constructor(http: Http, usersService: UsersService, router: Router) {
    this.http = http;
    this.usersService = usersService;
    this.router = router;
  }

  private toQueryString(queryParams: {[key: string]: string}) {
    return Object.keys(queryParams)
                 .filter(k => paramsWhiteList.hasOwnProperty(k))
                 .map(k => paramsWhiteList[k] + '=' + queryParams[k])
                 .join('&');
  }

  getAll(queryParams: {[key: string]: string}): Observable<Product[]> {
    var user = this.usersService.getCurrentUser();
    if (user == null) {
      this.router.navigate(['Home']);
      return Observable.empty();
    }
    let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': 'X-Basic ' + window.btoa(user.username + ':' + user.password) });
    let options = new RequestOptions({ headers: headers });
    var obs = this.http.get('/api/products?' + this.toQueryString(queryParams), options)
                       .map(res => res.json())
                       .map(ps => ps.map(this.hydrate));
    obs.subscribe(s => {}, e => {
      if(e.status == 401) {
        localStorage.clear();
        this.router.navigate(['Home']);
      }
    });
    return obs;
  }

  add(params: any, queryParams: {[key: string]: string}): Observable<Product[]> {
    var user = this.usersService.getCurrentUser();
    if (user == null) {
      this.router.navigate(['Home']);
      return Observable.empty();
    }
    let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': 'X-Basic ' + window.btoa(user.username + ':' + user.password) });
    let options = new RequestOptions({ headers: headers });

    var obs = this.http.put('api/products?' + this.toQueryString(queryParams), JSON.stringify(params), options)
                    .map(res => res.json())
                    .map(ps => ps.map(this.hydrate));
    obs.subscribe(s => {}, e => {
      if(e.status == 401) {
        localStorage.clear();
        this.router.navigate(['Home']);
      }
    });
    return obs;
  }

  update(id: number, params: any, queryParams: {[key: string]: string}): Observable<Product[]> {
    var user = this.usersService.getCurrentUser();
    if (user == null) {
      this.router.navigate(['Home']);
      return Observable.empty();
    }
    let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': 'X-Basic ' + window.btoa(user.username + ':' + user.password) });
    let options = new RequestOptions({ headers: headers });

    var obs = this.http.post('api/products/' + id + '?' + this.toQueryString(queryParams), JSON.stringify(params), options)
                    .map(res => res.json())
                    .map(ps => ps.map(this.hydrate));

    obs.subscribe(s => {}, e => {
      if(e.status == 401) {
        localStorage.clear();
        this.router.navigate(['Home']);
      }
    });
    return obs;
  }

  private hydrate(p: any) {
    return new Product( p.id, p.name, p.price, p.unitType, p.unitQuantity);
  }
}