import {Observable} from 'rxjs/Observable';
import {Objects} from './objects';
import {Db} from './db';
import * as path from 'path';

var sqlite = require('sqlite3').verbose();

const DEFAULT_PAGE_SIZE = 1000;

export interface SqliteConfig {
  dbName: string;
}

export class SqliteDb implements Db {
  db: any;

  constructor(config: SqliteConfig) {
    let db = new sqlite.Database(path.resolve(__dirname, '../' + config.dbName + '.sqlite'));
    //this.db = new DbWrapper(db);
    this.db = db;
  }

  private static getFields(fields: string[], obj: any): string[] {
    var whiteListed = Objects.whiteList(obj, fields);
    return Object.getOwnPropertyNames(whiteListed);
  }

  private static buildSqlParams(fields: string[], params: any, extra?: any): any {
    var whiteListed = Objects.whiteList(params, fields); 
    return Objects.extend(whiteListed, extra);  
  }

  private static buildPagingParams(queryParams: any): any {
    var pageSize = +(queryParams.pageSize || DEFAULT_PAGE_SIZE);
    var startIndex = (+(queryParams.page || 1) - 1) * pageSize;
    return {
      count: pageSize,
      skip: startIndex
    };
  }

  private static convertParams(sql: string) {
    let result = sql.replace(/@(\w+)/g, '$$$1');
    return result;
  }

  private static escapeParams(params: any) {
    return Objects.convertPropertyNames(params, p => '$' + p);
  }
  
  all<T>(sql: string, params: any, queryParams: any, create: (row: any) => T): Observable<T[]> {
    return Observable.create((o: any) => {
      this.db.all(SqliteDb.convertParams(sql) + ' limit $count offset $skip', SqliteDb.escapeParams(Objects.extend(params, SqliteDb.buildPagingParams(queryParams))), (err: any, rows: any) => {
        if(err) {
          o.error(err);
          return;
        }

        var results: T[] = (rows || [])
          .map((r:any) => Objects.convertPropertyNames(r, c => c.toLowerCase()))
          .map(create);
        o.next(results);
        o.complete();
      });
    });
  }

  allWithReduce<T>(sql: string, params: any, queryParams: any, create: (rows: any[]) => T[]): Observable<T[]> {
    return Observable.create((o: any) => {
      this.db.all(SqliteDb.convertParams(sql) + ' limit $count offset $skip', SqliteDb.escapeParams(Objects.extend(params, SqliteDb.buildPagingParams(queryParams))), (err: any, rows: any) => {
        if(err) {
          o.error(err);
          return;
        }

        var results = create((rows || [])
          .map((r:any) => Objects.convertPropertyNames(r, c => c.toLowerCase()))
        );
        o.next(results);
        o.complete();
      });
    });
  }

  single<T>(sql: string, params: any, create: (row: any) => T): Observable<T> {
    return Observable.create((o: any) => {
      this.db.get(SqliteDb.convertParams(sql), SqliteDb.escapeParams(params), (err: any, row: any) => {
        if(err) {
          o.error(err);
          return;
        }

        var result: T = row ? create(Objects.convertPropertyNames(row, c => c.toLowerCase())) : null;
        o.next(result);
        o.complete();
      });
    });
  }

  singleWithReduce<T>(sql: string, params: any, create: (rows: any[]) => T): Observable<T> {
    return Observable.create((o: any) => {
      this.db.all(SqliteDb.convertParams(sql), SqliteDb.escapeParams(params), (err: any, rows: any) => {
        if(err) {
          o.error(err);
          return;
        }

        var result = create((rows || [])
          .map((r:any) => Objects.convertPropertyNames(r, c => c.toLowerCase())));
        o.next(result);
        o.complete();
      });
    });
  }

  update(table: string, fields: string[], id: number, params: any) {
   var sql = 'update '
      + table 
      + ' set '
      + SqliteDb.getFields(fields, params).map((f:string) => f + ' = $' + f).join(', ')
      + ' where id = $id';

    return Observable.create((o: any) => {
      this.db.run(sql, SqliteDb.escapeParams(SqliteDb.buildSqlParams(fields, params, {id: id})), (err: any) => {
        if(err) {
          o.error(err);
          return;
        }

        o.next(null);
        o.complete();
      });
    });
  }

  insert(table: string, fields: string[], params: any) {
    var sql = 'insert into '
      + table 
      + ' ('
      + SqliteDb.getFields(fields, params).join(', ')
      + ') values ('
      + SqliteDb.getFields(fields, params).map((f:string) => '$' + f).join(', ')
      + ')';

    return Observable.create((o: any) => {
      this.db.run(sql, SqliteDb.escapeParams(SqliteDb.buildSqlParams(fields, params)), (err: any) => {
        if(err) {
          o.error(err);
          return;
        }

        o.next(null);
        o.complete();
      });
    });
  }

  delete(table: string, id: number) {
   var sql = 'delete from '
      + table 
      + ' where id = $id';
      
    return Observable.create((o: any) => {
      this.db.run(sql, { $id: id }, (err: any) => {
        if(err) {
          o.error(err);
          return;
        }

        o.next(null);
        o.complete();
      });
    });
  }

  execute(sql: string, params: any) {
    return Observable.create((o: any) => {
      this.db.run(SqliteDb.convertParams(sql), SqliteDb.escapeParams(params), (err: any) => {
        if(err) {
          o.error(err);
          return;
        }
        
        o.next(null);
        o.complete();
      });
    });
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