import {Order, OrderItem, OrderDiscount} from './customer'
import {Observable} from 'rxjs/Observable';
import {Db} from '../shared/db';
import {Objects} from '../shared/objects';
import 'rxjs/add/operator/mergeMap';

export class OrderService {
  boxFields: string[] = ['quantity'];
  productFields: string[] = ['quantity'];
  discountFields: string[] = ['name', 'total'];

  get(id: number, db: Db): Observable<Order> {
    return db.singleWithReduce<Order>(
      ' select'
    + '  o.id orderId, o.customerId customerId'
    + ', ob.boxId boxid, ob.quantity boxquantity'
    + ', b.name boxname, b.price boxprice'
    + ', op.productId productid, op.quantity productquantity'
    + ', p.name productname, p.unitType productunittype, p.price productprice'
    + ', d.id discountId, d.name discountName, d.total discountTotal'
    + ' from [order] o'
    + ' left join order_box ob on ob.orderId = o.id'
    + ' left join box b on b.id = ob.boxId'
    + ' left join order_product op on op.orderId = o.id'
    + ' left join product p on p.id = op.productId'
    + ' left join orderDiscount d on d.orderId = o.id'
    + ' where o.id = @id'
    + ' order by b.name, p.name',
      {id: id},
      rows => {
        let order: Order = null;
        for(let r of rows) {
          if(!order) {
            order = new Order(r.orderid, r.customerId, [], [], [], 0);
          }

          if(r.boxid) {
            if(order.boxes.findIndex(b => b.id == r.boxid) == -1) {
              order.boxes.push(new OrderItem(r.boxid, r.boxname, r.boxprice, r.boxquantity, 'each', r.boxprice * r.boxquantity));
            }
          }
          
          if(r.productid) {
            if(order.extraProducts.findIndex(p => p.id == r.productid) == -1) {
              order.extraProducts.push(new OrderItem(r.productid, r.productname, r.productprice, r.productquantity, r.productunittype, r.productprice * r.productquantity));
            }
          }
          
          if(r.discountid) {
            if(order.discounts.findIndex(d => d.id == r.discountid) == -1) {
              order.discounts.push(new OrderDiscount(r.discountid, r.discountname, r.discounttotal));
            }
          }
        }
        order.total =
          order.boxes.reduce((total, b) => total + b.total, 0)
          + order.extraProducts.reduce((total, p) => total + p.total, 0)
          + order.discounts.reduce((total, d) => total + d.total, 0);

        return order;
      });
  }

  addBox(orderId: number, boxId: number, params: any, db: Db): Observable<UpdateOrderResponse> {
    let whiteListed = Objects.whiteList(params, this.boxFields);
    let columns = Object.getOwnPropertyNames(whiteListed);

    return db.execute(
        'insert into order_box (orderId, boxId, ' + columns.join(', ') + ')'
        + ' values (@orderId, @boxId, ' + columns.map(c => '@' + c).join(', ') + ')',
        Objects.extend(whiteListed, {orderId, boxId}))
      .mergeMap(() => this.get(orderId, db))
      .map(o => ({newOrderTotal: o.total}));
  }

  updateBox(orderId: number, boxId: number, params: any, db: Db): Observable<UpdateOrderResponse> {
    let whiteListed = Objects.whiteList(params, this.productFields);
    let columns = Object.getOwnPropertyNames(whiteListed);

    return db.execute(
        'update order_box set '
        + columns.map((f:string) => f + ' = @' + f).join(', ')
        + ' where orderId = @orderId and boxId = @boxId',
        Objects.extend(whiteListed, {orderId, boxId}))
      .mergeMap(() => this.get(orderId, db))
      .map(o => ({newOrderTotal: o.total}));
  }
  
  removeBox(orderId: number, boxId: number, db: Db): Observable<UpdateOrderResponse> {
    return db.execute(
        'delete from order_box'
        + ' where orderId = @orderId and boxId = @boxId',
        {orderId, boxId})
      .mergeMap(() => this.get(orderId, db))
      .map(o => ({newOrderTotal: o.total}));
  }

  addProduct(orderId: number, productId: number, params: any, db: Db): Observable<UpdateOrderResponse> {
    let whiteListed = Objects.whiteList(params, this.productFields);
    let columns = Object.getOwnPropertyNames(whiteListed);

    return db.execute(
        'insert into order_product (orderId, productId, ' + columns.join(', ') + ')'
        + ' values (@orderId, @productId, ' + columns.map(c => '@' + c).join(', ') + ')',
        Objects.extend(whiteListed, {orderId, productId}))
      .mergeMap(() => this.get(orderId, db))
      .map(o => ({newOrderTotal: o.total}));
  }

  updateProduct(orderId: number, productId: number, params: any, db: Db): Observable<UpdateOrderResponse> {
    let whiteListed = Objects.whiteList(params, this.productFields);
    let columns = Object.getOwnPropertyNames(whiteListed);

    return db.execute(
        'update order_product set '
        + columns.map((f:string) => f + ' = @' + f).join(', ')
        + ' where orderId = @orderId and productId = @productId',
        Objects.extend(whiteListed, {orderId, productId}))
      .mergeMap(() => this.get(orderId, db))
      .map(o => ({newOrderTotal: o.total}));
  }
  
  removeProduct(orderId: number, productId: number, db: Db): Observable<UpdateOrderResponse> {
    return db.execute(
        'delete from order_product'
        + ' where orderId = @orderId and productId = @productId',
        {orderId, productId})
      .mergeMap(() => this.get(orderId, db))
      .map(o => ({newOrderTotal: o.total}));
  }

  addDiscount(orderId: number, params: any, db: Db): Observable<AddDiscountResponse> {
    let whiteListed = Objects.whiteList(params, this.discountFields);
    let columns = Object.getOwnPropertyNames(whiteListed);

    return db.insert('orderDiscount', ['orderId', ...columns], Objects.extend(whiteListed, {orderId}))
      .mergeMap(discountId => this.get(orderId, db).map(o => ({order: o, discountId})))
      .map(o => ({newOrderTotal: o.order.total, newDiscountId: o.discountId}));
  }

  updateDiscount(orderId: number, discountId: number, params: any, db: Db): Observable<UpdateOrderResponse> {
    let whiteListed = Objects.whiteList(params, this.discountFields);
    let columns = Object.getOwnPropertyNames(whiteListed);

    return db.execute(
        'update orderDiscount set '
        + columns.map((f:string) => f + ' = @' + f).join(', ')
        + ' where orderId = @orderId and id = @discountId',
        Objects.extend(whiteListed, {orderId, discountId}))
      .mergeMap(() => this.get(orderId, db))
      .map(o => ({newOrderTotal: o.total}));;
  }
  
  removeDiscount(orderId: number, discountId: number, db: Db): Observable<UpdateOrderResponse> {
    return db.execute(
        'delete from orderDiscount'
        + ' where orderId = @orderId and id = @discountId',
        {orderId, discountId})
      .mergeMap(() => this.get(orderId, db))
      .map(o => ({newOrderTotal: o.total}));
  }
}

export class UpdateOrderResponse {
  constructor(
    public newOrderTotal: number
  ) {
  }
}

export class AddDiscountResponse {
  constructor(
    public newOrderTotal: number,
    public newDiscountId: number
  ) {
  }
}