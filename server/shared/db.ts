import {Observable} from 'rxjs/Observable';

export interface Db {
  all<T>(sql: string, params: any, queryParams: any, create: (row: any) => T): Observable<T[]>;
  allWithReduce<T>(sql: string, params: any, queryParams: any, create: (rows: any[]) => T[]): Observable<T[]>;
  single<T>(sql: string, params: any, create: (row: any) => T): Observable<T>;
  singleWithReduce<T>(sql: string, params: any, create: (rows: any[]) => T): Observable<T>;
  execute(sql: string, params: any): Observable<void>;

  update(table: string, fields: string[], id: number, params: any): Observable<void>;
  insert(table: string, fields: string[], params: any): Observable<void>;
  delete(table: string, id: number): Observable<void>;
}