import { Box, BoxProduct } from './box'
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
export class BoxService {
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

  getAll(queryParams: {[key: string]: string}): Observable<Box[]> {
    return this.http.get('/api/boxes?' + this.toQueryString(queryParams))
                       .map(res => res.json())
                       .map(ps => ps.map(this.hydrate));
  }

  add(params: any, queryParams: {[key: string]: string}): Observable<Box[]> {
    let options = new RequestOptions({ headers: new Headers({ 'Content-Type': 'application/json' }) });

    return this.http.put('api/boxes?' + this.toQueryString(queryParams), JSON.stringify(params), options)
                    .map(res => res.json())
                    .map(ps => ps.map(this.hydrate));
  }

  update(id: number, params: any, queryParams: {[key: string]: string}): Observable<Box[]> {
    let options = new RequestOptions({ headers: new Headers({ 'Content-Type': 'application/json' }) });

    return this.http.post('api/boxes/' + id + '?' + this.toQueryString(queryParams), JSON.stringify(params), options)
                    .map(res => res.json())
                    .map(ps => ps.map(this.hydrate));
  }

  delete(id: number, queryParams: {[key: string]: string}): Observable<Box[]> {
    let options = new RequestOptions({ headers: new Headers({ 'Content-Type': 'application/json' }) });

    return this.http.delete('api/boxes/' + id + '?' + this.toQueryString(queryParams), options)
                    .map(res => res.json())
                    .map(ps => ps.map(this.hydrate));
  }

  addProduct(id: number, productId: number, params: any, queryParams: {[key: string]: string}): Observable<Box[]> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.put('api/boxes/' + id + '/products/' + productId + '?' + this.toQueryString(queryParams), JSON.stringify(params), options)
                    .map(res => res.json())
                    .map(rs => rs.map(this.hydrate));
  }

  removeProduct(id: number, productId: number, queryParams: {[key: string]: string}): Observable<Box[]> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.delete('api/boxes/' + id + '/products/' + productId + '?' + this.toQueryString(queryParams), options)
                    .map(res => res.json())
                    .map(rs => rs.map(this.hydrate));
  }

  private hydrate(b: any) {
    return new Box(b.id, b.name, b.price, b.products.map((p:any) => new BoxProduct(p.id, p.name, p.quantity, p.unitType)));
 }
}