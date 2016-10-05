import {Round, RoundCustomer} from './round'
import {Observable} from 'rxjs/Observable';
import {SqlHelper} from '../shared/helpers';

export class RoundsService {
  sqlHelper = new SqlHelper<Round>('round', ['name']);

  getAll(queryParams: any, db: any): Observable<Round[]> {
    var sql = 'select r.id, r.name, c.id customerId, c.name customerName, c.address customerAddress from round r' 
            + ' join round_customer rc on rc.roundId = r.id'
            + ' join customer c on c.id = rc.customerId'
            + ' order by r.id desc, c.id desc';
    return this.sqlHelper.selectSql(db, sql, queryParams,
      rows => {
        let rounds: { [id: number]: Round; } = {};
        for(let r of rows) {
          if(!rounds[r.id]) {
            rounds[r.id] = new Round(r.id, r.name, []);
          }
          rounds[r.id].customers.push(new RoundCustomer(r.customerId, r.customerName, r.customerAddress));
        }
        let result: Round[] = [];
        for(let id in rounds) {
          result.unshift(rounds[id]);
        }
        return result;
      });
  }

  add(params: any, queryParams: any, db: any): Observable<Round[]> {
    this.sqlHelper.insert(db, params);

    return this.getAll(queryParams, db);
  }

  update(id: number, params: any, queryParams: any, db: any): Observable<Round[]> {
    this.sqlHelper.update(db, id, params);

    return this.getAll(queryParams, db);
  }

  delete(id: number, queryParams: any, db: any): Observable<Round[]> {
    this.sqlHelper.delete(db, id);

    return this.getAll(queryParams, db);
  }

  addCustomer(id: number, customerId: number, queryParams: any, db: any): Observable<Round[]> {
    db.run('insert into round_customer (roundId, customerId) values ($id, $customerId)', {
      $id: id, 
      $customerId: customerId
    });

    return this.getAll(queryParams, db);
  }
  
  removeCustomer(id: number, customerId: number, queryParams: any, db: any): Observable<Round[]> {
    db.run('delete from round_customer where roundId = $id and customerId = $customerId', {
      $id: id, 
      $customerId: customerId
    });

    return this.getAll(queryParams, db);
  }
}