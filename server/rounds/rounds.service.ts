import {Round, RoundCustomer} from './round'
import {Observable} from 'rxjs/Observable';
import {Db} from '../shared/db';

export class RoundsService {
  getAll(queryParams: any, db: Db): Observable<Round[]> {
    return db.allWithReduce<Round>(
      ' select r.id, r.name, c.id customerId, c.name customerName, c.address customerAddress, c.email customerEmail from round r' 
    + ' left join round_customer rc on rc.roundId = r.id'
    + ' left join customer c on c.id = rc.customerId'
    + ' order by r.id, c.name',
      {},
      queryParams,
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

  get(id: number, db: Db): Observable<Round> {
    return db.singleWithReduce<Round>(
      ' select r.id, r.name, c.id customerId, c.name customerName, c.address customerAddress, c.email customerEmail from round r' 
    + ' left join round_customer rc on rc.roundId = r.id'
    + ' left join customer c on c.id = rc.customerId'
    + ' where r.id = $id'
    + ' order by r.id, c.name',
      {$id: id},
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

  add(params: any, queryParams: any, db: Db): Observable<Round[]> {
    db.insert('round', ['name'], params);

    return this.getAll(queryParams, db);
  }

  update(id: number, params: any, queryParams: any, db: Db): Observable<Round[]> {
    db.update('round', ['name'], id, params);

    return this.getAll(queryParams, db);
  }

  delete(id: number, queryParams: any, db: Db): Observable<Round[]> {
    db.delete('round', id);
    
    db.execute('delete from round_customer where roundId = $id', {
      $id: id 
    });

    return this.getAll(queryParams, db);
  }

  addCustomer(id: number, customerId: number, queryParams: any, db: Db): Observable<Round[]> {
    db.execute('insert into round_customer (roundId, customerId) values ($id, $customerId)', {
      $id: id, 
      $customerId: customerId
    });

    return this.getAll(queryParams, db);
  }
  
  removeCustomer(id: number, customerId: number, queryParams: any, db: Db): Observable<Round[]> {
    db.execute('delete from round_customer where roundId = $id and customerId = $customerId', {
      $id: id, 
      $customerId: customerId
    });

    return this.getAll(queryParams, db);
  }
}