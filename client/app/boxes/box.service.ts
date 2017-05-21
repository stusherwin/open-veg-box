import { Box, BoxWithProducts } from './box'
import { ProductQuantity } from '../products/product'
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

  getAllWithProducts(queryParams: {[key: string]: string}): Observable<BoxWithProducts[]> {
    return this.http.get('/api/boxes?products=true&' + this.toQueryString(queryParams))
                       .map(res => res.json())
                       .map(ps => ps.map(this.hydrate));
  }

  add(params: any): Observable<number> {
    let options = new RequestOptions({ headers: new Headers({ 'Content-Type': 'application/json' }) });

    return this.http.put('api/boxes', JSON.stringify(params), options)
                    .map(res => res.json().id);
  }

  update(id: number, params: any): Observable<void> {
    let options = new RequestOptions({ headers: new Headers({ 'Content-Type': 'application/json' }) });

    return this.http.post('api/boxes/' + id, JSON.stringify(params), options)
                    .map(res => {});
  }

  delete(id: number): Observable<void> {
    let options = new RequestOptions({ headers: new Headers({ 'Content-Type': 'application/json' }) });

    return this.http.delete('api/boxes/' + id, options)
                    .map(res => {});
  }

  addProduct(id: number, productId: number, params: any): Observable<void> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.put('api/boxes/' + id + '/products/' + productId, JSON.stringify(params), options)
                    .map(res => {});
  }

  updateProduct(id: number, productId: number, params: any): Observable<void> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.post('api/boxes/' + id + '/products/' + productId, JSON.stringify(params), options)
                    .map(res => {});
  }

  removeProduct(id: number, productId: number): Observable<void> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.delete('api/boxes/' + id + '/products/' + productId, options)
                    .map(res => {});
  }

  private hydrate(b: any) : Box {
    if(!b) {
      return null;
    }
    
    return b.products
      ? new BoxWithProducts(b.id, b.name, b.price, b.products.map((p:any) => new ProductQuantity(p.id, p.name, p.quantity, p.unitType)))
      : new Box(b.id, b.name, b.price);
 }
}