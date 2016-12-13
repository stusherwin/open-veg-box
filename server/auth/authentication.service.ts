import {Organisation} from './organisation'
import {User} from './user'
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/fromPromise'
import 'rxjs/add/observable/of';
import * as path from 'path';
import {SqlHelper} from '../shared/helpers'

var sqlite = require('sqlite3').verbose();
var mainDb = new sqlite.Database(path.resolve(__dirname, '../main.sqlite'));
var organisationDbs: { [id: number]: any; } = {};

var sqlHelper = new SqlHelper<Organisation>('organisation', ['name', 'username', 'password', 'dbName', 'canSendEmails']);

sqlHelper.selectAll(mainDb, {}, r => new Organisation(r.id, r.name, r.username, r.password, r.dbName, r.canSendEmails))
         .subscribe(organisations => {
           for(var o of organisations) {
             organisationDbs[o.id] = new sqlite.Database(path.resolve(__dirname, '../', o.dbName + '.sqlite'));
           }
         });

export class AuthenticationService {
  getDb(organisationId: number) {
    return organisationDbs[organisationId];    
  }

  authenticate(username: string, password: string): Observable<Organisation> {
    return sqlHelper.select(mainDb,
                      { username: username, password: password },
                      r => new Organisation(r.id, r.name, r.username, r.password, r.dbName, r.canSendEmails))
                    .map( o => { 
                      if(o == null) { throw 'not found'; }
                      return o; });
  }
}