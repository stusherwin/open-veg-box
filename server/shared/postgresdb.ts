import {Observable} from 'rxjs/Observable';
import {Objects} from './objects';
import {Db} from './db';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/observable/empty';

var pgp = require('pg-promise')({});

const DEFAULT_PAGE_SIZE = 1000;

export interface PostgresDbConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
}

export class PostgresDb implements Db {
  db: any;

  constructor(config: PostgresDbConfig) {
    this.db = pgp(config);
  }

  all<T>(sql: string, params: any, queryParams: any, create: (row: any) => T): Observable<T[]> {
    return this.anyObs(sql, [])
      .map(rows => rows.map(create)); 
  }

  allWithReduce<T>(sql: string, params: any, queryParams: any, create: (rows: any[]) => T[]): Observable<T[]> {
    return this.anyObs(sql, [])
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
    return this.noneObs(
      'update '
      + table 
      + ' set '
      + PostgresDb.getFields(fields, params).map((f:string) => f + ' = @' + f).join(', ')
      + ' where id = @id',
      PostgresDb.buildSqlParams(fields, params, {id: id}));
  }

  insert(table: string, fields: string[], params: any) {
    return this.noneObs(
      'insert into '
      + table 
      + ' ('
      + PostgresDb.getFields(fields, params).join(', ')
      + ') values ('
      + PostgresDb.getFields(fields, params).map((f:string) => '@' + f).join(', ')
      + ')',
      PostgresDb.buildSqlParams(fields, params));
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
    return Observable.fromPromise<any>(this.db.one(PostgresDb.convertParams(sql), params)); 
  }

  private noneObs(sql: string, params: {}) {
    return Observable.fromPromise<void>(this.db.none(PostgresDb.convertParams(sql), params));
  }

  private static getFields(fields: string[], obj: any): string[] {
    var whiteListed = Objects.whiteList(obj, fields);
    return Object.getOwnPropertyNames(whiteListed);
  }

  private static buildSqlParams(fields: string[], params: any, extra?: any): any {
    var whiteListed = Objects.whiteList(params, fields); 
    return Objects.extend(whiteListed, extra);  
  }

  private static convertParams(sql: string) {
    return sql.replace(/@(\w+)/g, '$[$1]');
  }
}