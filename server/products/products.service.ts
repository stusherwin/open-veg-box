import {Product} from './product'
import {Observable} from 'rxjs/Observable';
import {Db} from '../shared/db';

export class ProductsService {
  fields: string[] = ['name', 'price', 'unitType', 'unitQuantity'];

  getAll(queryParams: any, db: Db): Observable<Product[]> {
    return db.all<Product>(
      ' select p.id, p.name, p.price, p.unitType, p.unitQuantity'
    + ' from product p'
    + ' order by p.id',
      {}, queryParams, r => new Product(r.id, r.name, r.price, r.unitType, r.unitQuantity));
  }

  add(params: any, queryParams: any, db: Db): Observable<Product[]> {
    db.insert('product', this.fields, params);

    return this.getAll(queryParams, db);
  }

  update(id: number, params: any, queryParams: any, db: Db): Observable<Product[]> {
    db.update('product', this.fields, id, params);

    return this.getAll(queryParams, db);
  }

  delete(id: number, queryParams: any, db: Db): Observable<Product[]> {
    db.delete('product', id);

    return this.getAll(queryParams, db);
  }
}