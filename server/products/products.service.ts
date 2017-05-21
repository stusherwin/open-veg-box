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
    + ' order by p.name',
      {}, queryParams, r => new Product(r.id, r.name, r.price, r.unittype, r.unitquantity));
  }

  add(params: any, db: Db): Observable<number> {
    return db.insert('product', this.fields, params);
  }

  update(id: number, params: any, db: Db): Observable<void> {
    return db.update('product', this.fields, id, params);
  }

  delete(id: number, db: Db): Observable<void> {
    return db.delete('product', id);
  }
}