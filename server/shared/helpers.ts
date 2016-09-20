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
  private create: (row: any) => T;
  private defaultPageSize: number;

  constructor(table: string, fields: string[], create: (row: any) => T, defaultPageSize?: number) {
    this.table = table;
    this.fields = fields;
    this.create = create;
    this.defaultPageSize = defaultPageSize || 1000;
  }

  private buildSqlParams = function(params: any, id?: number): any {
    var sqlParams = {};
    for(var field of this.fields) {
      sqlParams['$' + field] = params[field];
    }
    if (id){
      sqlParams['$id'] = id;
    }
    return sqlParams;  
  }

  selectAll = function(db: any, queryParams: any): Observable<T[]> {
    return Observable.create((o: any) => {
      var pageSize = +(queryParams.pageSize || this.defaultPageSize);
      var startIndex = (+(queryParams.page || 1) - 1) * pageSize;
      db.all('select * from ' + this.table + ' order by id desc limit $count offset $skip', {
        $count: pageSize,
        $skip: startIndex
      }, (err: any, rows: any) => {
        var results: T[] = rows.map(this.create);
        o.next(results);
        o.complete();
      });
    });
  }

  update = function(db: any, id: number, params: any) {
   var updateSql = 'update '
      + this.table 
      + ' set '
      + this.fields.map((f:string) => f + ' = $' + f).join(', ')
      + ' where id = $id';
      
    db.run(updateSql, this.buildSqlParams(params, id));
  }

  insert = function(db: any, params: any) {
    var insertSql = 'insert into '
      + this.table 
      + ' ('
      + this.fields.join(', ')
      + ') values ('
      + this.fields.map((f:string) => '$' + f).join(', ')
      + ')';

    db.run(insertSql, this.buildSqlParams(params));
  }
}