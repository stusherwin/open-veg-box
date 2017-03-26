import {Customer, CustomerWithOrder, Order, OrderItem} from './customer'
import {Observable} from 'rxjs/Observable';
import {Db} from '../shared/db';
import 'rxjs/add/operator/mergeMap';

export class CustomersService {
  fields: string[] = ['name', 'address', 'tel1', 'tel2', 'email'];

  getAll(queryParams: any, db: Db): Observable<Customer[]> {
    if(queryParams.orders) {
      return this.allWithOrders(queryParams, db);
    } else {
      return this.all(queryParams, db);
    }
  }

  private allWithOrders(queryParams: any, db: Db): Observable<Customer[]> {
    return db.allWithReduce<CustomerWithOrder>(
      ' select'
    + '  c.id, c.name, c.address, c.tel1, c.tel2, c.email'
    + ', o.id orderid'
    + ', ob.boxId boxid, ob.quantity boxquantity'
    + ', b.name boxname, b.price boxprice'
    + ', op.productId productid, op.quantity productquantity'
    + ', p.name productname, p.unitType productunittype, p.price productprice'
    + ' from customer c'
    + ' left join [order] o on o.customerId = c.id'
    + ' left join order_box ob on ob.orderId = o.id'
    + ' left join box b on b.id = ob.boxId'
    + ' left join order_product op on op.orderId = o.id'
    + ' left join product p on p.id = op.productId'
    + ' order by o.id, b.name, p.name',
      {},
      queryParams,
      rows => {
        let customers: { [id: number]: CustomerWithOrder; } = {};
        for(let r of rows) {
          if(!customers[r.id]) {
            let order = new Order(r.orderid, r.id, [], [], 0);
            customers[r.id] = new CustomerWithOrder(r.id, r.name, r.address, r.tel1, r.tel2, r.email, order);
          }

          if(r.boxid) {
            if(customers[r.id].order.boxes.findIndex(b => b.id == r.boxid) == -1) {
              customers[r.id].order.boxes.push(new OrderItem(r.boxid, r.boxname, r.boxquantity, 'each', r.boxprice * r.boxquantity));
            }
          }
          
          if(r.productid) {
            if(customers[r.id].order.extraProducts.findIndex(p => p.id == r.productid) == -1) {
              customers[r.id].order.extraProducts.push(new OrderItem(r.productid, r.productname, r.productquantity, r.productunittype, r.productprice * r.productquantity));
            }
          }
        }
        let result: CustomerWithOrder[] = [];
        for(let id in customers) {
          customers[id].order.total =
            customers[id].order.boxes.reduce((total, b) => total + b.total, 0)
            + customers[id].order.extraProducts.reduce((total, p) => total + p.total, 0);
          result.push(customers[id]);
        }
        return result;
      });
  }
  
  private all(queryParams: any, db: Db): Observable<Customer[]> {
    return db.all<Customer>(
      ' select c.id, c.name, c.address, c.tel1, c.tel2, c.email from customer c' 
    + ' left join round_customer rc on rc.customerId = c.id'
    + ' order by c.name',
      {}, queryParams, r => new Customer(r.id, r.name, r.address, r.tel1, r.tel2, r.email));
  }
  
  getAllHavingNoRound(queryParams: any, db: Db): Observable<Customer[]> {
    return db.all<Customer>(
      ' select c.id, c.name, c.address, c.tel1, c.tel2, c.email from customer c' 
    + ' left join round_customer rc on rc.customerId = c.id'
    + ' where rc.roundId is null'
    + ' order by c.name',
      {}, queryParams, r => new Customer(r.id, r.name, r.address, r.tel1, r.tel2, r.email));
  }

  get(id: number, db: Db): Observable<Customer> {
    return db.single<Customer>(
      ' select c.id, c.name, c.address, c.tel1, c.tel2, c.email from customer c'
    + ' where c.id = @id',
      {id: id}, r => new Customer(r.id, r.name, r.address, r.tel1, r.tel2, r.email));
  }
  
  add(params: any, queryParams: any, db: Db): Observable<CustomerWithOrder[]> {
    return db.insert('customer', this.fields, params)
      .mergeMap(() => this.getAll(queryParams, db));
  }

  update(id: number, params: any, queryParams: any, db: Db): Observable<CustomerWithOrder[]> {
    return db.update('customer', this.fields, id, params)
      .mergeMap(() => this.getAll(queryParams, db));
  }

  delete(id: number, queryParams: any, db: Db): Observable<CustomerWithOrder[]> {
    return db.delete('customer', id)
      .mergeMap(() => this.getAll(queryParams, db));
  }
}