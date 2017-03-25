import {CustomerOrder, CustomerOrderItem} from './customer'
import {Observable} from 'rxjs/Observable';
import {Db} from '../shared/db';
import {Objects} from '../shared/objects';
import 'rxjs/add/operator/mergeMap';

export class OrderService {
  boxFields: string[] = ['quantity'];
  productFields: string[] = ['quantity'];

  get(id: number, db: Db): Observable<CustomerOrder> {
    return db.singleWithReduce<CustomerOrder>(
      ' select'
    + '  o.id orderId, o.customerId customerId'
    + ', ob.boxId boxid, ob.quantity boxquantity'
    + ', b.name boxname, b.price boxprice'
    + ', op.productId productid, op.quantity productquantity'
    + ', p.name productname, p.unitType productunittype, p.price productprice'
    + ' from [order] o'
    + ' left join order_box ob on ob.orderId = o.id'
    + ' left join box b on b.id = ob.boxId'
    + ' left join order_product op on op.orderId = o.id'
    + ' left join product p on p.id = op.productId'
    + ' where o.id = @id'
    + ' order by b.name, p.name',
      {id: id},
      rows => {
        let order: CustomerOrder = null;
        for(let r of rows) {
          if(!order) {
            order = new CustomerOrder(r.orderid, r.customerId, [], [], 0);
          }

          if(r.boxid) {
            if(order.boxes.findIndex(b => b.id == r.boxid) == -1) {
              order.boxes.push(new CustomerOrderItem(r.boxid, r.boxname, r.boxquantity, 'each', r.boxprice * r.boxquantity));
            }
          }
          
          if(r.productid) {
            if(order.extraProducts.findIndex(p => p.id == r.productid) == -1) {
              order.extraProducts.push(new CustomerOrderItem(r.productid, r.productname, r.productquantity, r.productunittype, r.productprice * r.productquantity));
            }
          }
        }
        order.total =
          order.boxes.reduce((total, b) => total + b.total, 0)
          + order.extraProducts.reduce((total, p) => total + p.total, 0);

        return order;
      });
  }

  addBox(orderId: number, boxId: number, params: any, db: Db): Observable<CustomerOrder> {
    let whiteListed = Objects.whiteList(params, this.boxFields);
    let columns = Object.getOwnPropertyNames(whiteListed);

    return db.execute(
        'insert into order_box (orderId, boxId, ' + columns.join(', ') + ')'
        + ' values (@orderId, @boxId, ' + columns.map(c => '@' + c).join(', ') + ')',
        Objects.extend(whiteListed, {orderId, boxId}))
      .mergeMap(() => this.get(orderId, db));
  }

  addProduct(orderId: number, productId: number, params: any, db: Db): Observable<CustomerOrder> {
    let whiteListed = Objects.whiteList(params, this.productFields);
    let columns = Object.getOwnPropertyNames(whiteListed);

    return db.execute(
        'insert into order_product (orderId, productId, ' + columns.join(', ') + ')'
        + ' values (@orderId, @productId, ' + columns.map(c => '@' + c).join(', ') + ')',
        Objects.extend(whiteListed, {orderId, productId}))
      .mergeMap(() => this.get(orderId, db));
  }

  updateBox(orderId: number, boxId: number, params: any, db: Db): Observable<CustomerOrder> {
    let whiteListed = Objects.whiteList(params, this.productFields);
    let columns = Object.getOwnPropertyNames(whiteListed);

    return db.execute(
        'update order_box set '
        + columns.map((f:string) => f + ' = @' + f).join(', ')
        + ' where orderId = @orderId and boxId = @boxId',
        Objects.extend(whiteListed, {orderId, boxId}))
      .mergeMap(() => this.get(orderId, db));
  }

  updateProduct(orderId: number, productId: number, params: any, db: Db): Observable<CustomerOrder> {
    let whiteListed = Objects.whiteList(params, this.productFields);
    let columns = Object.getOwnPropertyNames(whiteListed);

    return db.execute(
        'update order_product set '
        + columns.map((f:string) => f + ' = @' + f).join(', ')
        + ' where orderId = @orderId and productId = @productId',
        Objects.extend(whiteListed, {orderId, productId}))
      .mergeMap(() => this.get(orderId, db));
  }
  
  removeBox(orderId: number, boxId: number, db: Db): Observable<CustomerOrder> {
    return db.execute(
        'delete from order_box'
        + ' where orderId = @orderId and boxId = @boxId',
        {orderId, boxId})
      .mergeMap(() => this.get(orderId, db));
  }
  
  removeProduct(orderId: number, productId: number, db: Db): Observable<CustomerOrder> {
    return db.execute(
        'delete from order_product'
        + ' where orderId = @orderId and productId = @productId',
        {orderId, productId})
      .mergeMap(() => this.get(orderId, db));
  }
}