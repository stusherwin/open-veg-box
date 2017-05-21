import {Customer, CustomerWithOrder, Order, OrderItem} from './customer'
import {Observable} from 'rxjs/Observable';
import {Db} from '../shared/db';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/first';

export class CustomersService {
  fields: string[] = ['firstName', 'surname', 'address', 'tel1', 'tel2', 'email'];

  getAll(queryParams: any, db: Db): Observable<Customer[]> {
    if(queryParams.orders) {
      return this.allWithOrders(queryParams, {}, db, '');
    } else {
      return this.all(queryParams, db);
    }
  }

  private allWithOrders(queryParams: any, params: any, db: Db, whereClause: string): Observable<Customer[]> {
    return db.allWithReduce<CustomerWithOrder>(
      ' select'
    + '  c.id, c.firstname, c.surname, c.address, c.tel1, c.tel2, c.email'
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
    + ' ' + whereClause
    + ' order by c.surname, c.firstname, b.name, p.name',
      params,
      queryParams,
      rows => {
        let customers: CustomerWithOrder[] = [];
        for(let r of rows) {
          let customer = customers.find(c => c.id == r.id);

          if(!customer) {
            let order = new Order(r.orderid, r.id, [], [], 0);
            customer = new CustomerWithOrder(r.id, r.firstname, r.surname, r.address, r.tel1, r.tel2, r.email, order);
            customers.push(customer);
          }

          if(r.boxid) {
            if(customer.order.boxes.findIndex(b => b.id == r.boxid) == -1) {
              customer.order.boxes.push(new OrderItem(r.boxid, r.boxname, r.boxprice, r.boxquantity, 'each', r.boxprice * r.boxquantity));
            }
          }
          
          if(r.productid) {
            if(customer.order.extraProducts.findIndex(p => p.id == r.productid) == -1) {
              customer.order.extraProducts.push(new OrderItem(r.productid, r.productname, r.productprice, r.productquantity, r.productunittype, r.productprice * r.productquantity));
            }
          }
        }

        for(let customer of customers) {
          customer.order.total =
            customer.order.boxes.reduce((total, b) => total + b.total, 0)
            + customer.order.extraProducts.reduce((total, p) => total + p.total, 0);
        }

        return customers;
      });
  }
  
  private all(queryParams: any, db: Db): Observable<Customer[]> {
    return db.all<Customer>(
      ' select c.id, c.firstname, c.surname, c.address, c.tel1, c.tel2, c.email from customer c' 
    + ' left join round_customer rc on rc.customerId = c.id'
    + ' order by c.surname, c.firstname',
      {}, queryParams, r => new Customer(r.id, r.firstname, r.surname, r.address, r.tel1, r.tel2, r.email));
  }
  
  getAllHavingNoRound(queryParams: any, db: Db): Observable<Customer[]> {
    return db.all<Customer>(
      ' select c.id, c.firstname, c.surname, c.address, c.tel1, c.tel2, c.email from customer c' 
    + ' left join round_customer rc on rc.customerId = c.id'
    + ' where rc.roundId is null'
    + ' order by c.surname, c.firstname',
      {}, queryParams, r => new Customer(r.id, r.firstname, r.surname, r.address, r.tel1, r.tel2, r.email));
  }

  get(id: number, queryParams: any, db: Db): Observable<Customer> {
    if(queryParams.orders) {
      return this.allWithOrders(queryParams, {id}, db, 'where c.id = @id').map(cs => cs.length? cs[0] : null);
    } else {
      return db.single<Customer>(
      ' select c.id, c.firstname, c.surname, c.address, c.tel1, c.tel2, c.email from customer c'
    + ' where c.id = @id',
      {id}, r => new Customer(r.id, r.firstname, r.surname, r.address, r.tel1, r.tel2, r.email));
    }
  }
  
  add(params: any, db: Db): Observable<number> {
    return db.insert('customer', this.fields, params);
  }

  update(id: number, params: any, db: Db): Observable<void> {
    return db.update('customer', this.fields, id, params);
  }

  delete(id: number, db: Db): Observable<void> {
    return db.delete('customer', id);
  }
}