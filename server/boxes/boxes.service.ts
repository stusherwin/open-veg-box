import {Box, BoxProduct} from './box'
import {Observable} from 'rxjs/Observable';
import {Db} from '../shared/db';
import 'rxjs/add/operator/mergeMap';

export class BoxesService {
  fields: string[] = ['name', 'price'];

  // getAll(queryParams: any, db: Db): Observable<Box[]> {
  //   return db.all<Box>(
  //     ' select b.id, b.name, b.price'
  //   + ' from box b'
  //   + ' order by b.id',
  //     {}, queryParams, r => new Box(r.id, r.name, r.price, []));
  // }

  getAll(queryParams: any, db: Db): Observable<Box[]> {
    return db.allWithReduce<Box>(
      ' select b.id, b.name, b.price, p.id productId, p.name productName from box b' 
    + ' left join box_product bp on bp.boxId = b.id'
    + ' left join product p on p.id = bp.productId'
    + ' order by b.id, p.name',
      {},
      queryParams,
      rows => {
        let boxes: { [id: number]: Box; } = {};
        for(let r of rows) {
          if(!boxes[r.id]) {
            boxes[r.id] = new Box(r.id, r.name, r.price, []);
          }
          if(r.productid) {
            boxes[r.id].products.push(new BoxProduct(r.productid, r.productname));
          }
        }
        let result: Box[] = [];
        for(let id in boxes) {
          result.push(boxes[id]);
        }
        return result;
      });
  }

  add(params: any, queryParams: any, db: Db): Observable<Box[]> {
    return db.insert('box', this.fields, params)
      .mergeMap(() => this.getAll(queryParams, db));
  }

  update(id: number, params: any, queryParams: any, db: Db): Observable<Box[]> {
    return db.update('box', this.fields, id, params)
      .mergeMap(() => this.getAll(queryParams, db));
  }

  delete(id: number, queryParams: any, db: Db): Observable<Box[]> {
    return db.delete('box', id)
      .mergeMap(() => this.getAll(queryParams, db));
  }

  addProduct(id: number, productId: number, queryParams: any, db: Db): Observable<Box[]> {
    return db.execute('insert into box_product (boxId, productId) values (@id, @productId)', {
      id,
      productId
    }).mergeMap(() => this.getAll(queryParams, db));
  }
  
  removeProduct(id: number, productId: number, queryParams: any, db: Db): Observable<Box[]> {
    return db.execute('delete from box_product where boxId = @id and productId = @productId', {
      id,
      productId
    }).mergeMap(() => this.getAll(queryParams, db));
  }
}