import {Delivery} from './delivery'
import {Observable} from 'rxjs/Observable';
import {SqlHelper} from '../shared/helpers';

export class DeliveriesService {
  sqlHelper = new SqlHelper<Delivery>('delivery',
    ['name'],
    r => new Delivery(r.id, r.name));

  getAll(queryParams: any, db: any): Observable<Delivery[]> {
    return this.sqlHelper.selectAll(db, queryParams);
  }

  add(params: any, queryParams: any, db: any): Observable<Delivery[]> {
    this.sqlHelper.insert(db, params);

    return this.sqlHelper.selectAll(db, queryParams);
  }

  update(id: number, params: any, queryParams: any, db: any): Observable<Delivery[]> {
    this.sqlHelper.update(db, id, params);

    return this.sqlHelper.selectAll(db, queryParams);
  }

  delete(id: number, queryParams: any, db: any): Observable<Delivery[]> {
    this.sqlHelper.delete(db, id);

    return this.sqlHelper.selectAll(db, queryParams);
  }
}