import {Round} from './round'
import {Observable} from 'rxjs/Observable';
import {SqlHelper} from '../shared/helpers';

export class RoundsService {
  sqlHelper = new SqlHelper<Round>('round',
    ['name'],
    r => new Round(r.id, r.name));

  getAll(queryParams: any, db: any): Observable<Round[]> {
    return this.sqlHelper.selectAll(db, queryParams);
  }

  add(params: any, queryParams: any, db: any): Observable<Round[]> {
    this.sqlHelper.insert(db, params);

    return this.sqlHelper.selectAll(db, queryParams);
  }

  update(id: number, params: any, queryParams: any, db: any): Observable<Round[]> {
    this.sqlHelper.update(db, id, params);

    return this.sqlHelper.selectAll(db, queryParams);
  }

  delete(id: number, queryParams: any, db: any): Observable<Round[]> {
    this.sqlHelper.delete(db, id);

    return this.sqlHelper.selectAll(db, queryParams);
  }
}