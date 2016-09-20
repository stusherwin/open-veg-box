import {Customer} from './customer'
import {Observable} from 'rxjs/Observable';
import {SqlHelper} from '../shared/helpers';

export class CustomersService {
  sqlHelper = new SqlHelper<Customer>('customer',
    ['name', 'address', 'tel1', 'tel2', 'email'],
    r => new Customer(r.id, r.name, r.address, r.tel1, r.tel2, r.email));

  getAll(queryParams: any, db: any): Observable<Customer[]> {
    return this.sqlHelper.selectAll(db, queryParams);
  }

  add(params: any, queryParams: any, db: any): Observable<Customer[]> {
    this.sqlHelper.insert(db, params);

    return this.sqlHelper.selectAll(db, queryParams);
  }

  update(id: number, params: any, queryParams: any, db: any): Observable<Customer[]> {
    this.sqlHelper.update(db, id, params);

    return this.sqlHelper.selectAll(db, queryParams);
  }
}