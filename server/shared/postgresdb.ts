import {Observable} from 'rxjs/Observable';
import {Objects} from './objects';
import {Query} from './query';
import {Db} from './db';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/observable/empty';

var pgp = require('pg-promise')({});

export class PostgresDb implements Db {
  db: any;

  constructor(connectionString: string) {
    this.db = pgp(connectionString);
  }

  all<T>(sql: string, params: any, queryParams: any, create: (row: any) => T): Observable<T[]> {
    return this.anyObs(sql + ' limit @count offset @skip', Objects.extend(params, Query.convertPagingParams(queryParams)))
      .map(rows => rows.map(create)); 
  }

  allWithReduce<T>(sql: string, params: any, queryParams: any, create: (rows: any[]) => T[]): Observable<T[]> {
    return this.anyObs(sql + ' limit @count offset @skip', Objects.extend(params, Query.convertPagingParams(queryParams)))
      .map(create);     
  }

  single<T>(sql: string, params: any, create: (row: any) => T): Observable<T> {
    return this.oneObs(sql, params)
      .map(row => row ? create(row) : null)
  }

  singleWithReduce<T>(sql: string, params: any, create: (rows: any[]) => T): Observable<T> {
    return this.anyObs(sql, params)
      .map(create);     
  }

  update(table: string, fields: string[], id: number, params: any) {
    let whiteListed = Objects.whiteList(params, fields);
    let columns = Object.getOwnPropertyNames(whiteListed);

    return this.noneObs(
      'update '
      + table 
      + ' set '
      + columns.map((f:string) => f + ' = @' + f).join(', ')
      + ' where id = @id',
      Objects.extend(whiteListed, {id}));
  }

  insert(table: string, fields: string[], params: any) {
    let whiteListed = Objects.whiteList(params, fields);
    let columns = Object.getOwnPropertyNames(whiteListed);

    return this.noneObs(
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
    return this.noneObs(
      'delete from '
      + table 
      + ' where id = @id',
      {id: id});
  }

  execute(sql: string, params: any) {
    return this.noneObs(sql, params);
  }

  private anyObs(sql: string, params: {}) {
    return Observable.fromPromise<any[]>(this.db.any(PostgresDb.convertParams(sql), params));
  }

  private oneObs(sql: string, params: {}) {
    return Observable.fromPromise<any>(this.db.oneOrNone(PostgresDb.convertParams(sql), params)); 
  }

  private noneObs(sql: string, params: {}) {
    return Observable.fromPromise<void>(this.db.none(PostgresDb.convertParams(sql), params));
  }

  private static convertParams(sql: string) {
    return sql.replace(/@(\w+)/g, '$[$1]');
  }
}