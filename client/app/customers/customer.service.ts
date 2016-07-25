import { Customer } from './customer'
import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/map';
import 'rxjs/Rx'

@Injectable()
export class CustomerService {
  http: Http;

  customers: Customer[] = [
    new Customer(1, "Fred Bloggs"),
    new Customer(2, "Jane Doe")
  ];

  getAll(queryParams: {[key: string]: string}): Observable<Customer[]> {
    console.log(this.customers);
    return Observable.of(this.customers);
  }

  add(params: any, queryParams: {[key: string]: string}): Observable<Customer[]> {
    var id = this.customers.map(c => c.id).reduce((m, c) => c > m ? c : m, 0) + 1;
    var customer = new Customer(id, params.name);
    this.customers.splice(0, 0, customer);

    return Observable.of(this.customers);
  }

  update(id: number, params: any, queryParams: {[key: string]: string}): Observable<Customer[]> {
    var customer = this.customers.find(c => c.id == id);
    customer.name = params.name;

    return Observable.of(this.customers);
  }
}