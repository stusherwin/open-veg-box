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

  all<T>(sql: string, params: any, queryParams: any, create: (row: any) => T): Observable<T[]> {
    return Observable.fromPromise<any[]>(this.db.any(PostgresDb.convertParams(sql), [])).map(x => x.map(create)); 
  }

  allWithReduce<T>(sql: string, params: any, queryParams: any, create: (rows: any[]) => T[]): Observable<T[]> {
    return Observable.fromPromise<any[]>(this.db.any(PostgresDb.convertParams(sql), [])).map(create);     
  }

  single<T>(sql: string, params: any, create: (row: any) => T): Observable<T> {
    return Observable.fromPromise<any>(this.db.one(PostgresDb.convertParams(sql), params)).map(create); 
  }

  singleWithReduce<T>(sql: string, params: any, create: (rows: any[]) => T): Observable<T> {
    return Observable.fromPromise<any[]>(this.db.any(PostgresDb.convertParams(sql), params)).map(create);     
  }

  update(table: string, fields: string[], id: number, params: any) {
    var sql = 'update '
      + table 
      + ' set '
      + PostgresDb.getFields(fields, params).map((f:string) => f + ' = ${' + f + '}').join(', ')
      + ' where id = ${id}';
      
    return Observable.fromPromise<void>(this.db.none(sql, PostgresDb.buildSqlParams(fields, params, {id: id})));
  }

  insert(table: string, fields: string[], params: any) {
    var sql = 'insert into '
      + table 
      + ' ('
      + PostgresDb.getFields(fields, params).join(', ')
      + ') values ('
      + PostgresDb.getFields(fields, params).map((f:string) => '${' + f + '}').join(', ')
      + ')';

    return Observable.fromPromise<void>(this.db.none(sql, PostgresDb.buildSqlParams(fields, params)));
  }

  delete(table: string, id: number) {
    var sql = 'delete from '
      + table 
      + ' where id = ${id}';
   
    return Observable.fromPromise<void>(this.db.none(sql, {id: id}));
  }

  execute(sql: string, params: any) {
    return Observable.fromPromise<void>(this.db.none(PostgresDb.convertParams(sql), params));
  }
}