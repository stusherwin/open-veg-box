import {Customer} from './customer'
import {Observable} from 'rxjs/Observable';
import {SqlHelper} from '../shared/helpers';

export class CustomersService {
  sqlHelper = new SqlHelper<Customer>('customer', ['name', 'address', 'tel1', 'tel2', 'email']);

  getAll(queryParams: any, db: any): Observable<Customer[]> {
    return this.sqlHelper.selectAll(db, queryParams,
      r => new Customer(r.id, r.name, r.address, r.tel1, r.tel2, r.email));
  }
  
  getAllWithNoRound(queryParams: any, db: any): Observable<Customer[]> {
    var sql = 'select c.id, c.name, c.address, c.tel1, c.tel2, c.email from customer c' 
            + ' left join round_customer rc on rc.customerId = c.id'
            + ' where rc.roundId is null'
            + ' order by c.name';
    return this.sqlHelper.selectSql(db, sql, queryParams, {},
      r => new Customer(r.id, r.name, r.address, r.tel1, r.tel2, r.email));
  }
  
  add(params: any, queryParams: any, db: any): Observable<Customer[]> {
    this.sqlHelper.insert(db, params);

    return this.getAll(queryParams, db);
  }

  update(id: number, params: any, queryParams: any, db: any): Observable<Customer[]> {
    this.sqlHelper.update(db, id, params);

    return this.getAll(queryParams, db);
  }

  delete(id: number, queryParams: any, db: any): Observable<Customer[]> {
    this.sqlHelper.delete(db, id);

    return this.getAll(queryParams, db);
  }
}