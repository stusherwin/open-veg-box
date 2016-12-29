import {Product} from './product'
import {Observable} from 'rxjs/Observable';
import {Db} from '../shared/db';
import 'rxjs/add/operator/mergeMap';

export class ProductsService {
  fields: string[] = ['name', 'price', 'unitType', 'unitQuantity'];

  getAll(queryParams: any, db: Db): Observable<Product[]> {
    return db.all<Product>(
      ' select p.id, p.name, p.price, p.unitType, p.unitQuantity'
    + ' from product p'
    + ' order by p.id',
      {}, queryParams, r => new Product(r.id, r.name, r.price, r.unittype, r.unitquantity));
  }

  add(params: any, queryParams: any, db: Db): Observable<Product[]> {
    return db.insert('product', this.fields, params)
      .mergeMap(() => this.getAll(queryParams, db));
  }

  update(id: number, params: any, queryParams: any, db: Db): Observable<Product[]> {
    return db.update('product', this.fields, id, params)
      .mergeMap(() => this.getAll(queryParams, db));
  }

  delete(id: number, queryParams: any, db: Db): Observable<Product[]> {
    return db.delete('product', id)
      .mergeMap(() => this.getAll(queryParams, db));
  }
}