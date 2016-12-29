import {Organisation} from './organisation'
import {User} from './user'
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/fromPromise'
import 'rxjs/add/observable/of';
import {Db} from '../shared/db'
import {SqliteDb} from '../shared/sqlitedb'
import {PostgresDb} from '../shared/postgresdb'

var mainDb = new SqliteDb({ dbName: 'main' });
var organisationDbs: { [id: number]: Db; } = {};

mainDb.all<Organisation>(
      ' select o.id, o.name, o.username, o.password, o.canSendEmails, o.dbType, o.dbConfig'
      + ' from organisation o',
        {}, {}, r => new Organisation(r.id, r.name, r.username, r.cansendemails, r.dbtype, r.dbconfig))
      .subscribe(organisations => {
        for(var o of organisations) {
          let config = JSON.parse(o.dbConfig);

          switch(o.dbType) {
            case 'postgres':
              organisationDbs[o.id] = new PostgresDb(config);
              break;
            case 'sqlite':
              organisationDbs[o.id] = new SqliteDb(config);
              break;
          }
        }
      }, console.error);

export class AuthenticationService {
  getDb(organisationId: number) {
    return organisationDbs[organisationId];    
  }

  authenticate(username: string, password: string): Observable<Organisation> {
    return mainDb.single<Organisation>(
      ' select o.id, o.name, o.username, o.password, o.canSendEmails, o.dbType, o.dbConfig'
    + ' from organisation o'
    + ' where o.username = @username and o.password = @password',
      { username: username, password: password },
      r => new Organisation(r.id, r.name, r.username, r.cansendemails, r.dbtype, r.dbconfig));
  }
}