import {Observable} from 'rxjs/Observable';

export let wl = function(props: any, obj: any): any {
  return makeWl(props)(obj);
}

export let makeWl = function(props: any): (o:any) => any {
  return function(obj: any) {
    if(!obj) {
      return obj;
    }
    
    var result = {};
    var destProps: string[] = props instanceof Array? props : Object.getOwnPropertyNames(props);
    for(var srcProp in obj) {
      if(destProps.indexOf(srcProp) >= 0) {
        var destProp = props instanceof Array? srcProp : props[srcProp];
        result[destProp] = obj[srcProp];
      }
    }
    return result;
  }
}

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
    var properties = Object.getOwnPropertyNames(obj);
    var result: string[] = [];
    for(var property of properties) {
      if(this.fields.indexOf(property) > -1) {
        result.push(property);
      }
    }

    return result;
  }

  private buildSqlParams = function(params: any, id?: number): any {
    var sqlParams = {};
    for(var field in wl(this.fields, params)) {
      sqlParams['$' + field] = params[field];
    }
    if (id){
      sqlParams['$id'] = id;
    }
    return sqlParams;  
  }

  selectAll = function(db: any, queryParams: any, create: (row: any) => T): Observable<T[]> {
    return Observable.create((o: any) => {
      var pageSize = +(queryParams.pageSize || this.defaultPageSize);
      var startIndex = (+(queryParams.page || 1) - 1) * pageSize;
      db.all('select * from ' + this.table + ' order by id desc limit $count offset $skip', {
        $count: pageSize,
        $skip: startIndex
      }, (err: any, rows: any) => {
        var results: T[] = rows.map(create);
        o.next(results);
        o.complete();
      });
    });
  }

  selectSql = function(db: any, sql: string, queryParams: any, create: (rows: any[]) => T[]): Observable<T[]> {
    return Observable.create((o: any) => {
      var pageSize = +(queryParams.pageSize || this.defaultPageSize);
      var startIndex = (+(queryParams.page || 1) - 1) * pageSize;
      db.all(sql + ' limit $count offset $skip', {
        $count: pageSize,
        $skip: startIndex
      }, (err: any, rows: any) => {
        var results = create(rows);
        o.next(results);
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
      
    db.run(updateSql, this.buildSqlParams(params, id));
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