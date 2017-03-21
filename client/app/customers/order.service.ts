import { CustomerOrder, CustomerOrderItem } from './customer'
import { Injectable, Inject } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { UsersService } from '../users/users.service'
import { Router } from '@angular/router-deprecated';

import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/empty';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class OrderService {
  private http: Http;
  private router: Router;

  constructor(http: Http, router: Router) {
    this.http = http;
    this.router = router;
  }

  get(id: number): Observable<CustomerOrder> {
    return this.http.get('/api/order/' + id)
                       .map(res => res.json())
                       .map(this.hydrate);
  }

  addBox(id: number, boxId: number, params: any): Observable<CustomerOrder> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.put('api/order/' + id + '/boxes/' + boxId, JSON.stringify(params), options)
                    .map(res => res.json())
                    .map(this.hydrate);
  }

  updateBox(id: number, boxId: number, params: any): Observable<CustomerOrder> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.post('api/order/' + id + '/boxes/' + boxId, JSON.stringify(params), options)
                    .map(res => res.json())
                    .map(this.hydrate);
  }

  removeBox(id: number, boxId: number): Observable<CustomerOrder> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.delete('api/order/' + id + '/boxes/' + boxId, options)
                    .map(res => res.json())
                    .map(this.hydrate);
  }

  addProduct(id: number, productId: number, params: any): Observable<CustomerOrder> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.put('api/order/' + id + '/products/' + productId, JSON.stringify(params), options)
                    .map(res => res.json())
                    .map(this.hydrate);
  }

  updateProduct(id: number, productId: number, params: any): Observable<CustomerOrder> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.post('api/order/' + id + '/products/' + productId, JSON.stringify(params), options)
                    .map(res => res.json())
                    .map(this.hydrate);
  }

  removeProduct(id: number, productId: number): Observable<CustomerOrder> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.delete('api/order/' + id + '/products/' + productId, options)
                    .map(res => res.json())
                    .map(this.hydrate);
  }

  private hydrate(o: any) {
    console.log(o);
    return new CustomerOrder(
      o.id,
      o.customerId,
      o.boxes.map((b:any) => new CustomerOrderItem(b.id, b.name, b.quantity, b.unitType, b.total)),
      o.extraProducts.map((p:any) => new CustomerOrderItem(p.id, p.name, p.quantity, p.unitType, p.total)),
      o.total);
 }
}