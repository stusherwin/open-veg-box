import {Customer} from './customer'
import {Observable} from 'rxjs/Observable';
import {Db} from '../shared/db';

export class CustomersService {
  fields: string[] = ['name', 'address', 'tel1', 'tel2', 'email'];

  getAll(queryParams: any, db: Db): Observable<Customer[]> {
    return db.all<Customer>(
      ' select c.id, c.name, c.address, c.tel1, c.tel2, c.email'
    + ' from customer c'
    + ' order by c.id',
      {}, queryParams, r => new Customer(r.id, r.name, r.address, r.tel1, r.tel2, r.email));
  }
  
  getAllWithNoRound(queryParams: any, db: Db): Observable<Customer[]> {
    return db.all<Customer>(
      ' select c.id, c.name, c.address, c.tel1, c.tel2, c.email from customer c' 
    + ' left join round_customer rc on rc.customerId = c.id'
    + ' where rc.roundId is null'
    + ' order by c.name',
      {}, queryParams, r => new Customer(r.id, r.name, r.address, r.tel1, r.tel2, r.email));
  }

  get(id: number, db: Db): Observable<Customer> {
    return db.single<Customer>(
      ' select c.id, c.name, c.address, c.tel1, c.tel2, c.email from customer c'
    + ' where c.id = $id',
      {$id: id}, r => new Customer(r.id, r.name, r.address, r.tel1, r.tel2, r.email));
  }
  
  add(params: any, queryParams: any, db: Db): Observable<Customer[]> {
    db.insert('customer', this.fields, params);

    return this.getAll(queryParams, db);
  }

  update(id: number, params: any, queryParams: any, db: Db): Observable<Customer[]> {
    db.update('customer', this.fields, id, params);

    return this.getAll(queryParams, db);
  }

  delete(id: number, queryParams: any, db: Db): Observable<Customer[]> {
    db.delete('customer', id);

    return this.getAll(queryParams, db);
  }
}