import {Box, BoxWithProducts} from './box'
import {ProductQuantity} from '../products/product'
import {Observable} from 'rxjs/Observable';
import {Db} from '../shared/db';
import {Objects} from '../shared/objects';
import 'rxjs/add/operator/mergeMap';

export class BoxesService {
  boxFields: string[] = ['name', 'price'];
  boxProductFields: string[] = ['quantity'];

  getAll(queryParams: any, db: Db): Observable<Box[]> {
    if(queryParams.products) {
      return this.allWithProducts(queryParams, db);
    } else {
      return this.all(queryParams, db);
    }
  }

  private all(queryParams: any, db: Db): Observable<Box[]> {
    return db.all<Box>(
      ' select b.id, b.name, b.price from box b' 
    + ' order by b.name',
      {},
      queryParams,
      r => new Box(r.id, r.name, r.price));
  }

  private allWithProducts(queryParams: any, db: Db): Observable<BoxWithProducts[]> {
    return db.allWithReduce<BoxWithProducts>(
      ' select b.id, b.name, b.price, p.id productId, p.name productName, bp.quantity productQuantity, p.unitType productUnitType from box b' 
    + ' left join box_product bp on bp.boxId = b.id'
    + ' left join product p on p.id = bp.productId'
    + ' order by b.name, p.name',
      {},
      queryParams,
      rows => {
        let result: BoxWithProducts[] = [];
        for(let r of rows) {
          let box = result.find(b => b.id == r.id);
          if(!box) {
            box = new BoxWithProducts(r.id, r.name, r.price, []);
            result.push(box);
          }
          if(r.productid) {
            box.products.push(new ProductQuantity(r.productid, r.productname, r.productquantity, r.productunittype));
          }
        }
        return result;
      });
  }

  add(params: any, db: Db): Observable<number> {
    return db.insert('box', this.boxFields, params);
  }

  update(id: number, params: any, db: Db): Observable<void> {
    return db.update('box', this.boxFields, id, params);
  }

  delete(id: number, db: Db): Observable<void> {
    return db.execute('delete from box_product where boxId = @id', {id})
      .mergeMap(() => db.delete('box', id));
  }

  addProduct(id: number, productId: number, params: any, db: Db): Observable<void> {
    let whiteListed = Objects.whiteList(params, this.boxProductFields);
    let columns = Object.getOwnPropertyNames(whiteListed);

    return db.execute(
        'insert into box_product (boxId, productId, ' + columns.join(', ') + ')'
        + ' values (@id, @productId, ' + columns.map(c => '@' + c).join(', ') + ')',
        Objects.extend(whiteListed, {id, productId}));
  }

  updateProduct(id: number, productId: number, params: any, db: Db): Observable<void> {
    let whiteListed = Objects.whiteList(params, this.boxProductFields);
    let columns = Object.getOwnPropertyNames(whiteListed);

    return db.execute(
        'update box_product set '
        + columns.map((f:string) => f + ' = @' + f).join(', ')
        + ' where boxId = @id and productId = @productId',
        Objects.extend(whiteListed, {id, productId}));
  }
  
  removeProduct(id: number, productId: number, db: Db): Observable<void> {
    return db.execute(
        'delete from box_product'
        + ' where boxId = @id and productId = @productId',
        {id, productId});
  }
}