import {Product} from './product'
import { Observable } from 'rxjs/Observable';
// import { Rx } from 'rxjs/Rx'
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/fromPromise'

var sqlite = require('sqlite3').verbose();
var db = new sqlite.Database('C:/Dev/angular-quickstart/data.db');

const defaultPageSize: number = 10;

export class ProductsService {
  private updateProperty(dest: any, source: any, propertyName: string) {
    if(Object.getOwnPropertyNames(source).indexOf(propertyName) >= 0) {
      dest[propertyName] = source[propertyName];
    }
  }

  private hasProperty(source: any, propertyName: string) {
    return Object.getOwnPropertyNames(source).indexOf(propertyName) >= 0;
  }

  private getProperties(source: any, whiteList: string[]) {
    return Object.keys(source)
                 .filter(k => whiteList.indexOf(k) >= 0);
  }

  getAll(queryParams: any): Observable<Product[]> {
    console.log(queryParams);
    return Observable.create((o: any) => {
      var pageSize = +(queryParams.pageSize || defaultPageSize);
      var startIndex = (+(queryParams.page || 1) - 1) * pageSize;
      db.all('select * from product order by id desc limit $count offset $skip', {
        $count: pageSize,
        $skip: startIndex
      }, (err: any, rows: any) => {
        var products: Product[] = rows.map((row:any) => new Product(row.id, row.name, row.price, row.unitType, row.unitQuantity));
        o.next(products);
        o.complete();
      });
    });
  }

  add(params: any, queryParams: any): Observable<Product[]> {
    db.run('insert into product (name, price, unitType, unitQuantity) values ($name, $price, $unitType, $unitQuantity)', {
      $name: params.name,
      $price: params.price,
      $unitType: params.unitType,
      $unitQuantity: params.unitQuantity
    });

    return this.getAll(queryParams);
  }

  update(id: number, params: any, queryParams: any): Observable<Product[]> {
    var properties:string[] = this.getProperties(params, ['name', 'price', 'unitType', 'unitQuantity']);
    var updateSql = 'update product set ' + properties.map(p => p + ' = $' + p).join(', ') + ' where id = $id';
    
    db.run(updateSql, {
      $id: id,
      $name: params.name,
      $price: params.price,
      $unitType: params.unitType,
      $unitQuantity: params.unitQuantity
    });

    return this.getAll(queryParams);
  }
}