import { Customer, CustomerWithOrder } from './customer'
import { Order, OrderItem, OrderDiscount } from './orders/order'
import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/delay';

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
                    .map(ps => ps.map(this.hydrateWithOrder));
  }

  get(id: number): Observable<Customer> {
    return this.http.get('/api/customers/' + id)
                    .map(res => res.json())
                    .map(this.hydrate);
  }

  getWithOrder(id: number): Observable<CustomerWithOrder> {
    return this.http.get('/api/customers/' + id + '/?orders=true')
                    .map(res => res.json())
                    .map(this.hydrateWithOrder);
 
 }

  getAllWithNoRound(queryParams: {[key: string]: string}): Observable<Customer[]> {
    return this.http.get('/api/customers/no_round?' + this.toQueryString(queryParams))
                    .map(res => res.json())
                    .map(ps => ps.map(this.hydrate));
  }

  getPastOrders(id: number): Observable<ApiPastOrder[]> {
    return this.http.get('/api/customers/' + id + '/past-orders')
                    .map(res => res.json())
  }

  getPastPayments(id: number): Observable<ApiPastPayments> {
    return this.http.get('/api/customers/' + id + '/past-payments')
                    .map(res => res.json())
  }

  add(params: any): Observable<number> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.put('api/customers', JSON.stringify(params), options)
                    .map(res => res.json().id);
  }

  update(id: number, params: any): Observable<void> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.post('api/customers/' + id, JSON.stringify(params), options)
                    .map(res => {});
  }

  delete(id: number): Observable<void> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.delete('api/customers/' + id, options)
                    .map(res => {});
  }

  makePayment(id: number, request: ApiMakePaymentRequest): Observable<ApiMakePaymentResponse> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.post('api/customers/' + id + '/make-payment', JSON.stringify(request), options)
                    .map(res => res.json());
  }

  getCollectionPoints(id: number): Observable<ApiCollectionPoint[]> {
    return this.http.get('/api/customers/' + id + '/collection-points')
                    .map(res => res.json());
  }

  setCollectionPoint(id: number, collectionPointId: number): Observable<void> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.post('api/customers/' + id + '/set-collection-point', JSON.stringify({collectionPointId}), options)
                    .map(res => {});
  }

  private hydrate(c: any): Customer {
    if(!c) {
      return null;
    }

   return new Customer(c.id, c.firstName, c.surname, c.address, c.tel1, c.tel2, c.email, c.paymentMethod, c.paymentDetails);
  }

  private hydrateWithOrder(c: any): CustomerWithOrder {
    if(!c) {
      return null;
    }

   return new CustomerWithOrder(c.id, c.firstName, c.surname, c.address, c.tel1, c.tel2, c.email, c.paymentMethod, c.paymentDetails,
      new Order(
        c.order.id,
        c.order.customerId,
        c.order.boxes.map((b:any) => new OrderItem(b.id, b.name, b.price, b.quantity, b.unitType, b.total)),
        c.order.extraProducts.map((p:any) => new OrderItem(p.id, p.name, p.price, p.quantity, p.unitType, p.total)),
        (c.order.discounts || [{id: 123, name: 'Stu', total: -10}]).map((d:any) => new OrderDiscount(d.id, d.name, d.total)),
        c.order.total),
      c.collectionPointId);
  }
}

export class ApiPastOrder {
  id: number;
  date: string;
  totalCost: number;
  boxes: ApiPastOrderItem[];
  extraProducts: ApiPastOrderItem[];
}

export class ApiPastOrderItem {
  name: string;
  price: number;
  quantity: number;
  unitType: string;
  totalCost: number;
}

export class ApiPastPayment {
  date: string;
  amount: number;
  notes: string;
}

export class ApiPastPayments {
  currentBalance: number;
  pastPaymentsTotal: number;
  pastPayments: ApiPastPayment[];
}

export class ApiMakePaymentRequest {
  date: string;
  amount: number;
  notes: string;
}

export class ApiMakePaymentResponse {
  newCurrentBalance: number;
  newPastPaymentsTotal: number;
  newPastPayment: ApiPastPayment;
}

export class ApiCollectionPoint {
  id: number;
  name: string;
}