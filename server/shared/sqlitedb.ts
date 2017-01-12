import {Observable} from 'rxjs/Observable';
import {Objects} from './objects';
import {Query} from './query';
import {Db} from './db';
import * as path from 'path';
import 'rxjs/add/observable/bindNodeCallback';
import 'rxjs/add/operator/mergeMap';

var sqlite = require('sqlite3').verbose();

export class SqliteDb implements Db {
  db: any;

  constructor(dbName: string) {
    let db = new sqlite.Database(path.resolve(__dirname, '../' + dbName + '.sqlite'));
    
    db.run('PRAGMA foreign_keys=on');
    //this.db = new DbWrapper(db);
    this.db = db;
  }
  
  all<T>(sql: string, params: {}, queryParams: {}, create: (row: any) => T): Observable<T[]> {
    return this.allObs(sql + ' limit @count offset @skip', Objects.extend(params, Query.convertPagingParams(queryParams)))
      .map(r => r.map(create));
  }

  allWithReduce<T>(sql: string, params: {}, queryParams: {}, create: (rows: any[]) => T[]): Observable<T[]> {
    return this.allObs(sql + ' limit @count offset @skip', Objects.extend(params, Query.convertPagingParams(queryParams)))
      .map(create);
  }

  single<T>(sql: string, params: {}, create: (row: any) => T): Observable<T> {
    return this.getObs(sql, params)
      .map(row => row ? create(row) : null)
  }

  singleWithReduce<T>(sql: string, params: {}, create: (rows: any[]) => T): Observable<T> {
    return this.allObs(sql, params)
      .map(create);
  }

  update(table: string, fields: string[], id: number, params: {}) {
    let whiteListed = Objects.whiteList(params, fields);
    let columns = Object.getOwnPropertyNames(whiteListed);

    return this.runObs(
      'update '
      + table 
      + ' set '
      + columns.map((f:string) => f + ' = @' + f).join(', ')
      + ' where id = @id',
      Objects.extend(whiteListed, {id}));
  }

  insert(table: string, fields: string[], params: {}) {
    let whiteListed = Objects.whiteList(params, fields);
    let columns = Object.getOwnPropertyNames(whiteListed);

    return this.runObs(
      'insert into '
      + table 
      + ' ('
      + columns.join(', ')
      + ') values ('
      + columns.map((f:string) => '@' + f).join(', ')
      + ')',
      whiteListed);
  }

  delete(table: string, id: number) {
    return this.runObs(
      'delete from '
      + table 
      + ' where id = @id',
      { id: id });
  }

  execute(sql: string, params: {}) {
    return this.runObs(sql, params);
  }

  private allObs(sql: string, params: {}): Observable<any[]> {
    return Observable.bindNodeCallback<any[]>((sql: string, params: {}, callback: any) => this.db.all(sql, params, callback))
      (SqliteDb.convertParams(sql), SqliteDb.escapeParams(params))
      .map(rows => (rows || [])
        .map(r => Objects.convertPropertyNames(r, c => c.toLowerCase())));
  }

  private getObs(sql: string, params: {}): Observable<any> {
    // Would use db.get() but there's a bug in rxjs:
    // https://github.com/ReactiveX/rxjs/issues/2254

    // return Observable.bindNodeCallback<any>((sql: string, params: {}, callback: any) => this.db.get(sql, params, callback))
    //   (SqliteDb.convertParams(sql), SqliteDb.escapeParams(params))
    //     .map(row => row ? Objects.convertPropertyNames(row, c => c.toLowerCase()) : null);

    return Observable.bindNodeCallback<any[]>((sql: string, params: {}, callback: any) => this.db.all(sql, params, callback))
      (SqliteDb.convertParams(sql), SqliteDb.escapeParams(params))
        .map(rows => (rows || [])
          .map(r => Objects.convertPropertyNames(r, c => c.toLowerCase())))
        .map(rows => rows.length ? rows[0] : null);
  }

  private runObs(sql: string, params: {}): Observable<void> {
    return Observable.bindNodeCallback<any>((sql: string, params: {}, callback: any) => this.db.run(sql, params, callback)) 
      (SqliteDb.convertParams(sql), SqliteDb.escapeParams(params))
        .map(_ => null);
  }

  private static convertParams(sql: string) {
    return sql.replace(/@(\w+)/g, '$$$1');
  }

  private static escapeParams(params: {}) {
    return Objects.convertPropertyNames(params, p => '$' + p);
  }
}

class DbWrapper {
  constructor(private db: any) {
  }

  get(...args: any[]): any {
    console.log('get:');
    console.log(args);
    return this.db.get(...args);
  }

  all(...args: any[]): any {
    console.log('all:');
    console.log(args);
    return this.db.all(...args);
  }

  run(...args: any[]): any {
    console.log('run:');
    console.log(args);
    return this.db.run(...args);
  }
}