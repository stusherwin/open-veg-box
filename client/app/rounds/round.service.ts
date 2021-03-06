import { ProductQuantity } from '../products/product'
import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { DateString } from '../shared/dates'

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
                    .map(res => res.json());
  }

  get(id: number): Observable<Round> {
    return this.http.get('/api/rounds/' + id)
                    .map(res => {
                      let json = res.json();
                      return new Round(json.id, json.name, json.deliveryWeekday, DateString.fromJSONString(json.nextDeliveryDate), json.customers, json.deliveries.map((d: any) => new Delivery(d.id, DateString.fromJSONString(d.date), d.orderCount, d.orderTotal)));
                    });
  }

  getProductList(id: number): Observable<ProductList> {
    return this.http.get('/api/rounds/' + id + '/product_list')
                    .map(res => res.json());
  }

  getOrderList(id: number): Observable<CustomerOrderList> {
    return this.http.get('/api/rounds/' + id + '/order_list')
                    .map(res => res.json());
  }

  getDelivery(id: number, deliveryId: number): Observable<Delivery> {
    return this.http.get('/api/rounds/' + id + '/deliveries/' + deliveryId)
                    .map(res => {
                      let json = res.json();
                      if(!json) {
                        return null;
                      }
                      return new Delivery(json.id, DateString.fromJSONString(json.date), json.orderCount, json.orderTotal);
                    });
  }

  getDeliveryProductList(id: number, deliveryId: number): Observable<ProductList> {
    return this.http.get('/api/rounds/' + id + '/deliveries/' + deliveryId + '/product_list')
                    .map(res => res.json());
  }

  getDeliveryOrderList(id: number, deliveryId: number): Observable<CustomerOrderList> {
    return this.http.get('/api/rounds/' + id + '/deliveries/' + deliveryId + '/order_list')
                    .map(res => res.json());
  }

  add(params: any): Observable<number> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.put('api/rounds', JSON.stringify(params), options)
                    .map(res => res.json().id);
  }

  update(id: number, params: any): Observable<void> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.post('api/rounds/' + id, JSON.stringify(params), options)
                    .map(res => {});
  }

  updateNextDeliveryDate(id: number, date: DateString) {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    let params = date? {nextDeliveryDate: date.toString()} : {nextDeliveryDate: null};
    return this.http.post('api/rounds/' + id, JSON.stringify(params), options)
                    .map(res => {});
  }

  delete(id: number): Observable<void> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.delete('api/rounds/' + id, options)
                    .map(res => {});
  }

  addCustomer(id: number, customerId: number): Observable<void> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.put('api/rounds/' + id + '/customers/' + customerId, '', options)
                    .map(res => {});
  }

  removeCustomer(id: number, customerId: number): Observable<void> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.delete('api/rounds/' + id + '/customers/' + customerId, options)
                    .map(res => {});
  }

  excludeCustomerFromNextDelivery(id: number, customerId: number): Observable<void> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.post('api/rounds/' + id + '/customers/' + customerId + '/excludeFromNextDelivery', '', options)
                    .map(res => {});
  }

  includeCustomerInNextDelivery(id: number, customerId: number): Observable<void> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.post('api/rounds/' + id + '/customers/' + customerId + '/includeInNextDelivery', '', options)
                    .map(res => {});
  }

  createDelivery(id: number): Observable<DeliveryCreateResult> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.put('api/rounds/' + id + '/deliveries', '', options)
                    .map(res => res.json());
  }

  cancelDelivery(id: number, deliveryId: number): Observable<void> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.delete('api/rounds/' + id + '/deliveries/' + deliveryId, options)
                    .map(res => {});
  }

  getCollectionPoints(id: number): Observable<CollectionPoint[]> {
    return this.http.get('/api/rounds/' + id + '/collection-points')
                    .map(res => res.json());
  }

  addCollectionPoint(id: number, params: any): Observable<number> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.put('api/rounds/' + id + '/collection-points', JSON.stringify(params), options)
                    .map(res => res.json().id);
  }

  removeCollectionPoint(id: number, collectionPointId: number): Observable<void> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.delete('api/rounds/' + id + '/collection-points/' + collectionPointId, options)
                    .map(res => {});
  }

  updateCollectionPoint(id: number, collectionPointId: number, params: any): Observable<void> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.post('api/rounds/' + id + '/collection-points/' + collectionPointId, JSON.stringify(params), options)
                    .map(res => {});
  }
}

export class Round {
  constructor(
    public id: number,
    public name:string,
    public deliveryWeekday: number,
    public nextDeliveryDate: DateString,
    public customers: RoundCustomer[],
    public deliveries: Delivery[]) {
  }
 
  getNextDeliveryDate(): DateString {
    return this.nextDeliveryDate ||
      DateString.today().addDays(-1).getNextDayOfWeek(this.deliveryWeekday);
  }
}

export class RoundCustomer {
  constructor(
    public id: number,
    public name:string,
    public address: string,
    public email: string) {
  }
}

export class ProductList {
  totals: ProductQuantity[];
  customers: CustomerProductList[];
}

export class CustomerProductList {
  id: number;
  name: string;
  address: string;
  products: ProductQuantity[]
}

export class CustomerOrderList {
  totalCost: number;
  orders: CustomerOrder[];
}

export class CustomerOrder {
  id: number;
  name: string;
  address: string;
  totalCost: number;
  boxes: CustomerOrderItem[];
  extraProducts: CustomerOrderItem[];
  discounts: CustomerOrderItem[];
  excluded: boolean;
}

export class CustomerOrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  unitType: string;
  totalCost: number;
}

export class Delivery {
  constructor(
    public id: number,
    public date: DateString,
    public orderCount: number,
    public orderTotal: number
  ) {
  }
}

export class DeliveryCreateResult {
  id: number;
  orderCount: number;
  orderTotal: number;
}

export class CollectionPoint {
  id: number;
  name: string;
  address: string;
}