import {Organisation} from './organisation'
import {User} from './user'
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/fromPromise'
import 'rxjs/add/observable/of';
import * as path from 'path';
import {SqliteDb} from '../shared/sqlitedb'

var sqlite = require('sqlite3').verbose();
var mainDb = new SqliteDb(new sqlite.Database(path.resolve(__dirname, '../main.sqlite')));
var organisationDbs: { [id: number]: any; } = {};

mainDb.all<Organisation>('select o.id, o.name, o.username, o.password, o.dbName, o.canSendEmails, o.isPostGres from organisation o', {}, {}, r => new Organisation(r.id, r.name, r.username, r.password, r.dbName, r.canSendEmails, r.isPostGres))
      .subscribe(organisations => {
        for(var o of organisations) {
          organisationDbs[o.id] = new sqlite.Database(path.resolve(__dirname, '../', o.dbName + '.sqlite'));
        }
      }, console.error);

export class AuthenticationService {
  getDb(organisationId: number) {
    return organisationDbs[organisationId];    
  }

  authenticate(username: string, password: string): Observable<Organisation> {
    return mainDb.single<Organisation>(
      ' select o.id, o.name, o.username, o.password, o.dbName, o.canSendEmails, o.isPostGres'
    + ' from organisation o'
    + ' where o.username = $username and o.password = $password',
      { $username: username, $password: password },
      r => new Organisation(r.id, r.name, r.username, r.password, r.dbName, r.canSendEmails, r.isPostGres));
  }
}