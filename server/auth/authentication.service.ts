import {Organisation} from './organisation'
import {User} from './user'
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/fromPromise'
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/mergeMap';
import {Db} from '../shared/db'
import {SqliteDb} from '../shared/sqlitedb'
import {PostgresDb} from '../shared/postgresdb'
import {BehaviorSubject} from 'rxjs/BehaviorSubject'

export class AuthenticationService {
  constructor(private mainDb: Db, private dbs: {[organisationId: number]: Db}) {
  }

  authenticate(username: string, password: string): Observable<Organisation> {
    return this.mainDb.single<Organisation>(
      ' select o.id, o.name, o.username, o.canSendEmails'
    + ' from organisation o'
    + ' where o.username = @username and o.password = @password',
      { username: username, password: password },
      r => {
        return new Organisation(r.id, r.name, r.username, r.cansendemails, this.dbs[r.id]);
      });
  }
}