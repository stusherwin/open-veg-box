import {Customer, CustomerWithOrder, CustomerOrder, CustomerOrderItem} from './customer'
import {Observable} from 'rxjs/Observable';
import {Db} from '../shared/db';
import 'rxjs/add/operator/mergeMap';

export class CustomersService {
  fields: string[] = ['name', 'address', 'tel1', 'tel2', 'email'];

  getAll(queryParams: any, db: Db): Observable<CustomerWithOrder[]> {
    return db.allWithReduce<CustomerWithOrder>(
      ' select'
    + '  c.id, c.name, c.address, c.tel1, c.tel2, c.email'
    + ', co.id customerOrderId'
    + ', cob.boxId customerOrderBoxId, cob.quantity customerOrderBoxQuantity'
    + ', b.name customerOrderBoxName, b.price customerOrderBoxPrice'
    + ', cop.productId customerOrderProductId, cop.quantity customerOrderProductQuantity'
    + ', p.name customerOrderProductName, p.unitType customerOrderProductUnitType, p.price customerOrderProductPrice'
    + ' from customer c'
    + ' left join customerOrder co on co.customerId = c.id'
    + ' left join customerOrder_box cob on cob.customerOrderId = co.id'
    + ' left join box b on b.id = cob.boxId'
    + ' left join customerOrder_product cop on cop.customerOrderId = co.id'
    + ' left join product p on p.id = cop.productId'
    + ' order by c.id, customerOrderBoxName, customerOrderProductName',
      {},
      queryParams,
      rows => {
        let customers: { [id: number]: CustomerWithOrder; } = {};
        for(let r of rows) {
          if(!customers[r.id]) {
            let order = new CustomerOrder(r.customerorderid, r.id, [], [], 0);
            customers[r.id] = new CustomerWithOrder(r.id, r.name, r.address, r.tel1, r.tel2, r.email, order);
          }

          if(r.customerorderboxid) {
            if(customers[r.id].order.boxes.findIndex(b => b.id == r.customerorderboxid) == -1) {
              customers[r.id].order.boxes.push(new CustomerOrderItem(r.customerorderboxid, r.customerorderboxname, r.customerorderboxquantity, 'each', r.customerorderboxprice * r.customerorderboxquantity));
            }
          }
          
          if(r.customerorderproductid) {
            if(customers[r.id].order.extraProducts.findIndex(p => p.id == r.customerorderproductid) == -1) {
              customers[r.id].order.extraProducts.push(new CustomerOrderItem(r.customerorderproductid, r.customerorderproductname, r.customerorderproductquantity, r.customerorderproductunittype, r.customerorderproductprice * r.customerorderproductquantity));
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
  
  getAllWithNoRound(queryParams: any, db: Db): Observable<Customer[]> {
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
  
  add(params: any, queryParams: any, db: Db): Observable<Customer[]> {
    return db.insert('customer', this.fields, params)
      .mergeMap(() => this.getAll(queryParams, db));
  }

  update(id: number, params: any, queryParams: any, db: Db): Observable<Customer[]> {
    return db.update('customer', this.fields, id, params)
      .mergeMap(() => this.getAll(queryParams, db));
  }

  delete(id: number, queryParams: any, db: Db): Observable<Customer[]> {
    return db.delete('customer', id)
      .mergeMap(() => this.getAll(queryParams, db));
  }
}