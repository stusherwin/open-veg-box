import {Product} from './product'
import {Observable} from 'rxjs/Observable';
import {SqlHelper} from '../shared/helpers';

export class ProductsService {
  sqlHelper = new SqlHelper<Product>('product', ['name', 'price', 'unitType', 'unitQuantity']);

  getAll(queryParams: any, db: any): Observable<Product[]> {
    return this.sqlHelper.selectAll(db, queryParams,
      r => new Product(r.id, r.name, r.price, r.unitType, r.unitQuantity));
  }

  add(params: any, queryParams: any, db: any): Observable<Product[]> {
    this.sqlHelper.insert(db, params);

    return this.getAll(queryParams, db);
  }

  update(id: number, params: any, queryParams: any, db: any): Observable<Product[]> {
    this.sqlHelper.update(db, id, params);

    return this.getAll(queryParams, db);
  }

  delete(id: number, queryParams: any, db: any): Observable<Product[]> {
    this.sqlHelper.delete(db, id);

    return this.getAll(queryParams, db);
  }
}