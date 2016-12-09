import {Round, RoundCustomer} from './round'
import {Observable} from 'rxjs/Observable';
import {SqlHelper} from '../shared/helpers';

export class RoundsService {
  sqlHelper = new SqlHelper<Round>('round', ['name']);

  getAll(queryParams: any, db: any): Observable<Round[]> {
    var sql = 'select r.id, r.name, c.id customerId, c.name customerName, c.address customerAddress, c.email customerEmail from round r' 
            + ' left join round_customer rc on rc.roundId = r.id'
            + ' left join customer c on c.id = rc.customerId'
            + ' order by r.id, c.name';
    return this.sqlHelper.selectSqlRows(db, sql, queryParams, {},
      rows => {
        let rounds: { [id: number]: Round; } = {};
        for(let r of rows) {
          if(!rounds[r.id]) {
            rounds[r.id] = new Round(r.id, r.name, []);
          }
          if(r.customerId) {
            rounds[r.id].customers.push(new RoundCustomer(r.customerId, r.customerName, r.customerAddress, r.customerEmail));
          }
        }
        let result: Round[] = [];
        for(let id in rounds) {
          result.push(rounds[id]);
        }
        return result;
      });
  }

  get(id: number, db: any): Observable<Round> {
    var sql = 'select r.id, r.name, c.id customerId, c.name customerName, c.address customerAddress, c.email customerEmail from round r' 
            + ' left join round_customer rc on rc.roundId = r.id'
            + ' left join customer c on c.id = rc.customerId'
            + ' where r.id = $id'
            + ' order by r.id, c.name';
    return this.sqlHelper.selectSqlSingle(db, sql, {$id: id}, 
      rows => {
        let round: Round = null;
        for(let r of rows) {
          if(!round) {
            round = new Round(r.id, r.name, []);
          }
          if(r.customerId) {
            round.customers.push(new RoundCustomer(r.customerId, r.customerName, r.customerAddress, r.customerEmail));
          }
        }
        return round;
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
    
    db.run('delete from round_customer where roundId = $id', {
      $id: id 
    });

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