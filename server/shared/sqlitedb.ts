import {Observable} from 'rxjs/Observable';
import {Objects} from './objects';
import {Db} from './db';

const DEFAULT_PAGE_SIZE = 1000;

export class SqliteDb implements Db {
  db: any;

  constructor(db: any) {
    //this.db = new DbWrapper(db);
    this.db = db;
  }

  private static getFields(fields: string[], obj: any): string[] {
    var whiteListed = Objects.whiteList(obj, fields);
    return Object.getOwnPropertyNames(whiteListed);
  }

  private static buildSqlParams(fields: string[], params: any, extra?: any): any {
    var whiteListed = Objects.whiteList(params, fields); 
    var sqlParams = Objects.prependPropertyNames(whiteListed, '$');
    return Objects.extend(sqlParams, extra);  
  }

  private static buildPagingParams(queryParams: any): any {
    var pageSize = +(queryParams.pageSize || DEFAULT_PAGE_SIZE);
    var startIndex = (+(queryParams.page || 1) - 1) * pageSize;
    return {
      $count: pageSize,
      $skip: startIndex
    };
  }
  
  all<T>(sql: string, params: any, queryParams: any, create: (row: any) => T): Observable<T[]> {
    return Observable.create((o: any) => {
      this.db.all(sql + ' limit $count offset $skip', Objects.extend(params, SqliteDb.buildPagingParams(queryParams)), (err: any, rows: any) => {
        var results: T[] = (rows || []).map(create);
        o.next(results);
        o.complete();
      });
    });
  }

  allWithReduce<T>(sql: string, params: any, queryParams: any, create: (rows: any[]) => T[]): Observable<T[]> {
    return Observable.create((o: any) => {
      this.db.all(sql + ' limit $count offset $skip', Objects.extend(params, SqliteDb.buildPagingParams(queryParams)), (err: any, rows: any) => {
        var results = create(rows || []);
        o.next(results);
        o.complete();
      });
    });
  }

  single<T>(sql: string, params: any, create: (row: any) => T): Observable<T> {
    return Observable.create((o: any) => {
      this.db.get(sql, params, (err: any, row: any) => {
        var result: T = row ? create(row) : null;
        o.next(result);
        o.complete();
      });
    });
  }

  singleWithReduce<T>(sql: string, params: any, create: (rows: any[]) => T): Observable<T> {
    return Observable.create((o: any) => {
      this.db.all(sql, params, (err: any, rows: any) => {
        var result = create(rows || []);
        o.next(result);
        o.complete();
      });
    });
  }

  update(table: string, fields: string[], id: number, params: any) {
   var updateSql = 'update '
      + table 
      + ' set '
      + SqliteDb.getFields(fields, params).map((f:string) => f + ' = $' + f).join(', ')
      + ' where id = $id';
      
    this.db.run(updateSql, SqliteDb.buildSqlParams(fields, params, {$id: id}));
  }

  insert(table: string, fields: string[], params: any) {
    var insertSql = 'insert into '
      + table 
      + ' ('
      + SqliteDb.getFields(fields, params).join(', ')
      + ') values ('
      + SqliteDb.getFields(fields, params).map((f:string) => '$' + f).join(', ')
      + ')';

    this.db.run(insertSql, SqliteDb.buildSqlParams(fields, params));
  }

  delete(table: string, id: number) {
   var updateSql = 'delete from '
      + table 
      + ' where id = $id';
      
    this.db.run(updateSql, { $id: id });
  }

  execute(sql: string, params: any) {
    this.db.run(sql, params);
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