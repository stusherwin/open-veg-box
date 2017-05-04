import { Customer, CustomerWithOrder } from './customer'
import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

const paramsWhiteList = { p: 'page', ps: 'pageSize' };

@Injectable()
export class CustomerService {
  http: Http;

  constructor(http: Http) {
    this.http = http;
  }

  private toQueryString(queryParams: {[key: string]: string}) {
    return Object.keys(queryParams)
                 .filter(k => paramsWhiteList.hasOwnProperty(k))
                 .map(k => paramsWhiteList[k] + '=' + queryParams[k])
                 .join('&');
  }

  getAllWithOrders(queryParams: {[key: string]: string}): Observable<CustomerWithOrder[]> {
    return this.http.get('/api/customers?orders=true&' + this.toQueryString(queryParams))
                    .map(res => res.json())
                    .map(ps => ps.map(this.hydrate));
  }

  get(id: number): Observable<Customer> {
    return this.http.get('/api/customers/' + id)
                    .map(res => res.json())
                    .map(this.hydrate);
  }

  getWithOrder(id: number): Observable<CustomerWithOrder> {
    return this.http.get('/api/customers/' + id + '/?orders=true')
                    .map(res => res.json())
                    .map(this.hydrate);
  }

  getAllWithNoRound(queryParams: {[key: string]: string}): Observable<Customer[]> {
    return this.http.get('/api/customers/no_round?' + this.toQueryString(queryParams))
                    .map(res => res.json())
                    .map(ps => ps.map(this.hydrate));
  }

  add(params: any, queryParams: {[key: string]: string}): Observable<CustomerWithOrder[]> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.put('api/customers?orders=true&' + this.toQueryString(queryParams), JSON.stringify(params), options)
                    .map(res => res.json())
                    .map(ps => ps.map(this.hydrate));
  }

  update(id: number, params: any, queryParams: {[key: string]: string}): Observable<CustomerWithOrder[]> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.post('api/customers/' + id + '?orders=true&' + this.toQueryString(queryParams), JSON.stringify(params), options)
                    .map(res => res.json())
                    .map(ps => ps.map(this.hydrate));
  }

  delete(id: number, queryParams: {[key: string]: string}): Observable<CustomerWithOrder[]> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.delete('api/customers/' + id + '?orders=true&' + this.toQueryString(queryParams), options)
                    .map(res => res.json())
                    .map(ps => ps.map(this.hydrate));
  }

  private hydrate(c: any) {
    if(!c) {
      return null;
    }

   return new CustomerWithOrder(c.id, c.firstName, c.surname, c.address, c.tel1, c.tel2, c.email, c.order);
  }
}