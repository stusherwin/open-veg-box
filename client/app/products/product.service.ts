import { Product, UnitPrice } from './product'
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
  private router: Router;

  constructor(http: Http, router: Router) {
    this.http = http;
    this.router = router;
  }

  private toQueryString(queryParams: {[key: string]: string}) {
    return Object.keys(queryParams)
                 .filter(k => paramsWhiteList.hasOwnProperty(k))
                 .map(k => paramsWhiteList[k] + '=' + queryParams[k])
                 .join('&');
  }

  getAll(queryParams: {[key: string]: string}): Observable<Product[]> {
    return this.http.get('/api/products?' + this.toQueryString(queryParams))
                       .map(res => res.json())
                       .map(ps => ps.map(this.hydrate));
  }

  add(params: any, queryParams: {[key: string]: string}): Observable<Product[]> {
    let options = new RequestOptions({ headers: new Headers({ 'Content-Type': 'application/json' }) });

    return this.http.put('api/products?' + this.toQueryString(queryParams), JSON.stringify(params), options)
                    .map(res => res.json())
                    .map(ps => ps.map(this.hydrate));
  }

  update(id: number, params: any, queryParams: {[key: string]: string}): Observable<Product[]> {
    let options = new RequestOptions({ headers: new Headers({ 'Content-Type': 'application/json' }) });

    return this.http.post('api/products/' + id + '?' + this.toQueryString(queryParams), JSON.stringify(params), options)
                    .map(res => res.json())
                    .map(ps => ps.map(this.hydrate));
  }

  delete(id: number, queryParams: {[key: string]: string}): Observable<Product[]> {
    let options = new RequestOptions({ headers: new Headers({ 'Content-Type': 'application/json' }) });

    return this.http.delete('api/products/' + id + '?' + this.toQueryString(queryParams), options)
                    .map(res => res.json())
                    .map(ps => ps.map(this.hydrate));
  }

  private hydrate(p: any) {
    if(!p) {
      return null;
    }
    
    return new Product(p.id, p.name, new UnitPrice(p.price, p.unitType));
  }
}