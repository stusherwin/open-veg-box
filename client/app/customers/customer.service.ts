import { Customer } from './customer'
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

  getAll(queryParams: {[key: string]: string}): Observable<Customer[]> {
    return this.http.get('/api/customers?' + this.toQueryString(queryParams))
                    .map(res => res.json())
                    .map(ps => ps.map(this.hydrate));
  }

  add(params: any, queryParams: {[key: string]: string}): Observable<Customer[]> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.put('api/customers?' + this.toQueryString(queryParams), JSON.stringify(params), options)
                    .map(res => res.json())
                    .map(ps => ps.map(this.hydrate));
  }

  update(id: number, params: any, queryParams: {[key: string]: string}): Observable<Customer[]> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.post('api/customers/' + id + '?' + this.toQueryString(queryParams), JSON.stringify(params), options)
                    .map(res => res.json())
                    .map(ps => ps.map(this.hydrate));
  }

  delete(id: number, queryParams: {[key: string]: string}): Observable<Customer[]> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.delete('api/customers/' + id + '?' + this.toQueryString(queryParams), options)
                    .map(res => res.json())
                    .map(ps => ps.map(this.hydrate));
  }

  private hydrate(p: any) {
    return new Customer(p.id, p.name, p.address, p.tel1, p.tel2, p.email);
  }
}