import { Product } from './product'
import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class ProductService {
  http: Http;

  constructor(http: Http) {
    this.http = http;
  }

  getAll(): Observable<Product[]> {
    return this.http.get('/api/products')
                    .map(res => res.json())
                    .map(ps => ps.map(this.hydrate));
  }

  add(product: Product): Observable<Product> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.put('api/products', JSON.stringify(product), options)
                    .map(res => res.json())
                    .map(this.hydrate);
  }

  save(product: Product): Observable<Product> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.post('api/products/' + product.id, JSON.stringify(product), options)
                    .map(res => res.json())
                    .map(this.hydrate);
  }

  private hydrate(p: any) {
    return new Product( p.id, p.name, p.price, p.unitType, p.unitQuantity);
  }
}