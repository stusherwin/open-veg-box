import {Observable} from 'rxjs/Observable';
import {Objects} from './objects';

export class SqlHelper<T> {
  private table: string;
  private fields: string[];
  private defaultPageSize: number;

  constructor(table: string, fields: string[], defaultPageSize?: number) {
    this.table = table;
    this.fields = fields;
    this.defaultPageSize = defaultPageSize || 1000;
  }

  private getFields = function(obj: any): string[] {
    var whiteListed = Objects.whiteList(obj, this.fields);
    return Object.getOwnPropertyNames(whiteListed);
  }

  private buildSqlParams = function(params: any, extra: any): any {
    var whiteListed = Objects.whiteList(params, this.fields); 
    var sqlParams = Objects.prependPropertyNames(whiteListed, '$');
    return Objects.extend(sqlParams, extra);  
  }

  private buildPagingParams = function(queryParams: any): any {
    var pageSize = +(queryParams.pageSize || this.defaultPageSize);
    var startIndex = (+(queryParams.page || 1) - 1) * pageSize;
    return {
      $count: pageSize,
      $skip: startIndex
    };
  }

  selectAll = function(db: any, queryParams: any, create: (row: any) => T): Observable<T[]> {
    return Observable.create((o: any) => {
      db.all('select * from ' + this.table + ' order by id limit $count offset $skip', this.buildPagingParams(queryParams), (err: any, rows: any) => {
        var results: T[] = (rows || []).map(create);
        o.next(results);
        o.complete();
      });
    });
  }

  selectSql = function(db: any, sql: string, queryParams: any, params: any, create: (row: any) => T): Observable<T[]> {
    return Observable.create((o: any) => {
      db.all(sql + ' limit $count offset $skip', Objects.extend(params, this.buildPagingParams(queryParams)), (err: any, rows: any) => {
        var results: T[] = (rows || []).map(create);
        o.next(results);
        o.complete();
      });
    });
  }

  selectSqlRows = function(db: any, sql: string, queryParams: any, params: any, create: (rows: any[]) => T[]): Observable<T[]> {
    return Observable.create((o: any) => {
      db.all(sql + ' limit $count offset $skip', Objects.extend(params, this.buildPagingParams(queryParams)), (err: any, rows: any) => {
        var results = create(rows || []);
        o.next(results);
        o.complete();
      });
    });
  }

  selectSqlSingle = function(db: any, sql: string, params: any, create: (rows: any[]) => T): Observable<T> {
    return Observable.create((o: any) => {
      db.all(sql, params, (err: any, rows: any) => {
        var result = create(rows || []);
        o.next(result);
        o.complete();
      });
    });
  }

  select = function(db: any, params: any, create: (row: any) => T): Observable<T> {
    var selectSql = 'select * from ' 
        + this.table 
        + ' where '
        + this.getFields(params).map((f:string) => f + ' = $' + f).join(' and ')
        
        return Observable.create((o: any) => {
      
      db.get(selectSql, this.buildSqlParams(params), (err: any, row: any) => {
        var result: T = row ? create(row) : null;
        o.next(result);
        o.complete();
      });
    });
  }

  update = function(db: any, id: number, params: any) {
   var updateSql = 'update '
      + this.table 
      + ' set '
      + this.getFields(params).map((f:string) => f + ' = $' + f).join(', ')
      + ' where id = $id';
      
    db.run(updateSql, this.buildSqlParams(params, {$id: id}));
  }

  insert = function(db: any, params: any) {
    var insertSql = 'insert into '
      + this.table 
      + ' ('
      + this.getFields(params).join(', ')
      + ') values ('
      + this.getFields(params).map((f:string) => '$' + f).join(', ')
      + ')';

    db.run(insertSql, this.buildSqlParams(params));
  }

  delete = function(db: any, id: number) {
   var updateSql = 'delete from '
      + this.table 
      + ' where id = $id';
      
    db.run(updateSql, { $id: id });
  }
}