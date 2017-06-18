import { Order, OrderItem, OrderDiscount } from './order'
import { Injectable, Inject } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { UsersService } from '../../users/users.service'
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

  get(id: number): Observable<Order> {
    return this.http.get('/api/order/' + id)
                       .map(res => res.json())
                       .map(this.hydrate);
  }

  addBox(id: number, boxId: number, params: any): Observable<ApiUpdateOrderResponse> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.put('api/order/' + id + '/boxes/' + boxId, JSON.stringify(params), options)
                    .map(res => res.json())
  }

  updateBox(id: number, boxId: number, params: any): Observable<ApiUpdateOrderResponse> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.post('api/order/' + id + '/boxes/' + boxId, JSON.stringify(params), options)
                    .map(res => res.json())
  }

  removeBox(id: number, boxId: number): Observable<ApiUpdateOrderResponse> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.delete('api/order/' + id + '/boxes/' + boxId, options)
                    .map(res => res.json())
  }

  addProduct(id: number, productId: number, params: any): Observable<ApiUpdateOrderResponse> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.put('api/order/' + id + '/products/' + productId, JSON.stringify(params), options)
                    .map(res => res.json())
  }

  updateProduct(id: number, productId: number, params: any): Observable<ApiUpdateOrderResponse> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.post('api/order/' + id + '/products/' + productId, JSON.stringify(params), options)
                    .map(res => res.json())
  }

  removeProduct(id: number, productId: number): Observable<ApiUpdateOrderResponse> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.delete('api/order/' + id + '/products/' + productId, options)
                    .map(res => res.json())
  }

  addDiscount(id: number, params: any): Observable<ApiAddDiscountResponse> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.put('api/order/' + id + '/discounts', JSON.stringify(params), options)
                    .map(res => res.json())
  }

  updateDiscount(id: number, discountId: number, params: any): Observable<ApiUpdateOrderResponse> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.post('api/order/' + id + '/discounts/' + discountId, JSON.stringify(params), options)
                    .map(res => res.json())
  }

  removeDiscount(id: number, discountId: number): Observable<ApiUpdateOrderResponse> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.delete('api/order/' + id + '/discounts/' + discountId, options)
                    .map(res => res.json());
  }

  private hydrate(o: any) {
    return new Order(
      o.id,
      o.customerId,
      o.boxes.map((b:any) => new OrderItem(b.id, b.name, b.price, b.quantity, b.unitType, b.total)),
      o.extraProducts.map((p:any) => new OrderItem(p.id, p.name, p.price, p.quantity, p.unitType, p.total)),
      (o.discounts || []).map((d:any) => new OrderDiscount(d.id, d.name, d.total)),
      o.total);
 }
}

export class ApiUpdateOrderResponse {
  constructor(
    public newOrderTotal: number
  ) {
  }
}

export class ApiAddDiscountResponse {
  constructor(
    public newOrderTotal: number,
    public newDiscountId: number
  ) {
  }
}