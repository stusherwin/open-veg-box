import {Customer} from './customer'
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';

const defaultPageSize: number = 1000;

export class CustomersService {
  private updateProperty(dest: any, source: any, propertyName: string) {
    if(Object.getOwnPropertyNames(source).indexOf(propertyName) >= 0) {
      dest[propertyName] = source[propertyName];
    }
  }

  getAll(queryParams: any, db: any): Observable<Customer[]> {
    return Observable.create((o: any) => {
      var pageSize = +(queryParams.pageSize || defaultPageSize);
      var startIndex = (+(queryParams.page || 1) - 1) * pageSize;
      db.all('select * from customer order by id desc limit $count offset $skip', {
        $count: pageSize,
        $skip: startIndex
      }, (err: any, rows: any) => {
        var customers: Customer[] = rows.map((row:any) => new Customer(row.id, row.name, row.address, row.tel1, row.tel2, row.email));
        o.next(customers);
        o.complete();
      });
    });
  }

  add(params: any, queryParams: any, db: any): Observable<Customer[]> {
    return this.getAll(queryParams, db);
  }

  update(id: number, params: any, queryParams: any, db: any): Observable<Customer[]> {
    return this.getAll(queryParams, db);
  }
}