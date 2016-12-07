import { Round, RoundCustomer } from './round'
import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

const paramsWhiteList = { p: 'page', ps: 'pageSize' };

@Injectable()
export class RoundService {
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

  getAll(queryParams: {[key: string]: string}): Observable<Round[]> {
    return this.http.get('/api/rounds?' + this.toQueryString(queryParams))
                    .map(res => res.json())
                    .map(rs => rs.map(this.hydrate));
  }

  get(id: number): Observable<Round> {
    return this.http.get('/api/rounds/' + id)
                    .map(res => res.json())
                    .map(this.hydrate);
  }

  add(params: any, queryParams: {[key: string]: string}): Observable<Round[]> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.put('api/rounds?' + this.toQueryString(queryParams), JSON.stringify(params), options)
                    .map(res => res.json())
                    .map(rs => rs.map(this.hydrate));
  }

  update(id: number, params: any, queryParams: {[key: string]: string}): Observable<Round[]> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.post('api/rounds/' + id + '?' + this.toQueryString(queryParams), JSON.stringify(params), options)
                    .map(res => res.json())
                    .map(rs => rs.map(this.hydrate));
  }

  delete(id: number, queryParams: {[key: string]: string}): Observable<Round[]> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.delete('api/rounds/' + id + '?' + this.toQueryString(queryParams), options)
                    .map(res => res.json())
                    .map(rs => rs.map(this.hydrate));
  }

  addCustomer(id: number, customerId: number, queryParams: {[key: string]: string}): Observable<Round[]> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.put('api/rounds/' + id + '/customers/' + customerId + '?' + this.toQueryString(queryParams), '', options)
                    .map(res => res.json())
                    .map(rs => rs.map(this.hydrate));
  }

  removeCustomer(id: number, customerId: number, queryParams: {[key: string]: string}): Observable<Round[]> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.delete('api/rounds/' + id + '/customers/' + customerId + '?' + this.toQueryString(queryParams), options)
                    .map(res => res.json())
                    .map(rs => rs.map(this.hydrate));
  }

  private hydrate(r: any) {
    if(!r) {
      return null;
    }
    
    return new Round(r.id, r.name, r.customers.map((c:any) => new RoundCustomer(c.id, c.name, c.address)));
  }
}