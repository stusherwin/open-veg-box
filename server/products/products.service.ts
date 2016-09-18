import {Product} from './product'
import {Observable} from 'rxjs/Observable';

const defaultPageSize: number = 1000;

export class ProductsService {
  getAll(queryParams: any, db: any): Observable<Product[]> {
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

  add(params: any, queryParams: any, db: any): Observable<Product[]> {
    db.run('insert into product (name, price, unitType, unitQuantity) values ($name, $price, $unitType, $unitQuantity)', {
      $name: params.name,
      $price: params.price,
      $unitType: params.unitType,
      $unitQuantity: params.unitQuantity
    });

    return this.getAll(queryParams, db);
  }

  update(id: number, params: any, queryParams: any, db: any): Observable<Product[]> {
    var updateSql = 'update product set '
      + ['name', 'price', 'unitType', 'unitQuantity'].map(p => p + ' = $' + p).join(', ')
      + ' where id = $id';
    
    db.run(updateSql, {
      $id: id,
      $name: params.name,
      $price: params.price,
      $unitType: params.unitType,
      $unitQuantity: params.unitQuantity
    });

    return this.getAll(queryParams, db);
  }
}