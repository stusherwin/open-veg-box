import {Customer, CustomerWithOrder, Order, OrderItem, OrderDiscount} from './customer'
import {Observable} from 'rxjs/Observable';
import {Db} from '../shared/db';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/first';
import 'rxjs/add/observable/of';

export class CustomersService {
  fields: string[] = ['firstName', 'surname', 'address', 'tel1', 'tel2', 'email', 'paymentMethod', 'paymentDetails'];

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
    + '  c.id, c.firstname, c.surname, c.address, c.tel1, c.tel2, c.email, c.paymentMethod, c.paymentDetails'
    + ', o.id orderid'
    + ', ob.boxId boxid, ob.quantity boxquantity'
    + ', b.name boxname, b.price boxprice'
    + ', op.productId productid, op.quantity productquantity'
    + ', p.name productname, p.unitType productunittype, p.price productprice'
    + ', d.id discountId, d.name discountName, d.total discountTotal'
    + ', rc.collectionPointId'
    + ' from customer c'
    + ' left join [order] o on o.customerId = c.id'
    + ' left join order_box ob on ob.orderId = o.id'
    + ' left join box b on b.id = ob.boxId'
    + ' left join order_product op on op.orderId = o.id'
    + ' left join product p on p.id = op.productId'
    + ' left join orderDiscount d on d.orderId = o.id'
    + ' left join round_customer rc on rc.customerId = c.id'
    + ' ' + whereClause
    + ' order by c.surname, c.firstname, b.name, p.name',
      params,
      queryParams,
      rows => {
        let customers: CustomerWithOrder[] = [];
        for(let r of rows) {
          let customer = customers.find(c => c.id == r.id);

          if(!customer) {
            let order = new Order(r.orderid, r.id, [], [], [], 0);
            customer = new CustomerWithOrder(r.id, r.firstname, r.surname, r.address, r.tel1, r.tel2, r.email, r.paymentmethod, r.paymentdetails, order, r.collectionpointid);
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
          
          if(r.discountid) {
            if(customer.order.discounts.findIndex(d => d.id == r.discountid) == -1) {
              customer.order.discounts.push(new OrderDiscount(r.discountid, r.discountname, r.discounttotal));
            }
          }
        }

        for(let customer of customers) {
          customer.order.total =
            customer.order.boxes.reduce((total, b) => total + b.total, 0)
            + customer.order.extraProducts.reduce((total, p) => total + p.total, 0)
            + customer.order.discounts.reduce((total, d) => total + d.total, 0);
        }

        return customers;
      });
  }
  
  private all(queryParams: any, db: Db): Observable<Customer[]> {
    return db.all<Customer>(
      ' select c.id, c.firstname, c.surname, c.address, c.tel1, c.tel2, c.email, c.paymentMethod, c.paymentDetails from customer c' 
    + ' left join round_customer rc on rc.customerId = c.id'
    + ' order by c.surname, c.firstname',
      {}, queryParams, r => new Customer(r.id, r.firstname, r.surname, r.address, r.tel1, r.tel2, r.email, r.paymentmethod, r.paymentdetails));
  }
  
  getAllHavingNoRound(queryParams: any, db: Db): Observable<Customer[]> {
    return db.all<Customer>(
      ' select c.id, c.firstname, c.surname, c.address, c.tel1, c.tel2, c.email, c.paymentMethod, c.paymentDetails from customer c' 
    + ' left join round_customer rc on rc.customerId = c.id'
    + ' where rc.roundId is null'
    + ' order by c.surname, c.firstname',
      {}, queryParams, r => new Customer(r.id, r.firstname, r.surname, r.address, r.tel1, r.tel2, r.email, r.paymentmethod, r.paymentdetails));
  }

  get(id: number, queryParams: any, db: Db): Observable<Customer> {
    if(queryParams.orders) {
      return this.allWithOrders(queryParams, {id}, db, 'where c.id = @id').map(cs => cs.length? cs[0] : null);
    } else {
      return db.single<Customer>(
      ' select c.id, c.firstname, c.surname, c.address, c.tel1, c.tel2, c.email, c.paymentMethod, c.paymentDetails from customer c'
    + ' where c.id = @id',
      {id}, r => new Customer(r.id, r.firstname, r.surname, r.address, r.tel1, r.tel2, r.email, r.paymentmethod, r.paymentdetails));
    }
  }
  
  getPastOrders(id: number, db: Db): Observable<ApiPastOrder[]> {
    return db.allWithReduce<ApiPastOrder>(
      ' select orderId, deliveryDate, orderTotalCost, itemType, itemId, itemName, price, quantity, unittype, totalCost from'
    + ' (select ho.id orderId, d.date deliveryDate, ho.total orderTotalCost, \'product\' itemType, hop.productId itemId, hop.name itemName, hop.price, hop.unitType,'
    + ' hop.quantity, hop.price * hop.quantity totalCost'
    + ' from historicOrder ho'
    + ' inner join delivery d on d.id = ho.deliveryId'
    + ' inner join historicOrderedProduct hop on hop.orderId = ho.id'
    + ' where ho.customerId = @id'
    + ' union'
    + ' select ho.id orderId, d.date deliveryDate, ho.total orderTotalCost, \'box\' itemType, hob.boxId itemId, hob.name itemName, hob.price, \'each\' unitType,'
    + ' hob.quantity, hob.price * hob.quantity totalCost'
    + ' from historicOrder ho'
    + ' inner join delivery d on d.id = ho.deliveryId'
    + ' inner join historicOrderedBox hob on hob.orderId = ho.id'
    + ' where ho.customerId = @id) x'
    + ' order by deliveryDate desc, itemType, itemName',
      {id}, {}, rows => {
        let orders: ApiPastOrder[] = []
        for(let r of rows) {
          let order = orders.find(o => o.id == r.orderid);
          if(!order) {
            order = {id: r.orderid, date: r.deliverydate, totalCost: r.ordertotalcost, boxes: [], extraProducts: []};
            orders.push(order);
          }
          if(r.itemtype == 'box') {
            let box: ApiPastOrderItem = {name: r.itemname, price: r.price, unitType: r.unittype, quantity: r.quantity, totalCost: r.totalcost};
            order.boxes.push(box)
          } else if(r.itemtype == 'product') {
            let product: ApiPastOrderItem = {name: r.itemname, price: r.price, unitType: r.unittype, quantity: r.quantity, totalCost: r.totalcost};
            order.extraProducts.push(product)
          }
        }
        return orders;
      });
  }

  pastPayments = {
    currentBalance: -1233,
    pastPaymentsTotal: 120,
    pastPayments: [
      {date: '2017-06-01T00:00:00.000Z', amount: 10, notes: null},
      {date: '2017-05-25T00:00:00.000Z', amount: 12.5, notes: 'A note here'}
    ]
  };

  getPastPayments(id: number, db: Db): Observable<ApiPastPayments> {
    return db.all<ApiPastPayment>(
      ' select p.id, p.date, p.amount, p.notes'
    + ' from payment p'
    + ' where p.customerId = @id'
    + ' order by p.date desc, p.id desc',
      {id}, {}, r => ({id: r.id, date: r.date, amount: r.amount, notes: r.notes}))
    .mergeMap(payments => db.single<ApiPastPayments>(
      ' select coalesce(sum(o.total), 0) totalOwed'
    + ' from historicOrder o'
    + ' where o.customerId = @id',
      {id}, r => {
        let totalOwed: number = r.totalowed;
        let totalPaid: number = payments.reduce((t, p) => t + p.amount, 0);

        return {
          currentBalance: totalPaid - totalOwed,
          pastPaymentsTotal: totalPaid,
          pastPayments: payments
        }
      }))
  }
  
  add(params: any, db: Db): Observable<number> {
    return db.insert('customer', this.fields, params);
  }

  update(id: number, params: any, db: Db): Observable<void> {
    console.log(params);
    return db.update('customer', this.fields, id, params);
  }

  delete(id: number, db: Db): Observable<void> {
    return db.delete('customer', id);
  }

  makePayment(id: number, request: ApiMakePaymentRequest, db: Db): Observable<ApiMakePaymentResponse> {
    return db.insert('payment', ['customerId', 'date', 'amount', 'notes'], {customerId: id, date: request.date, amount: request.amount, notes: request.notes || ''})
    .mergeMap(paymentId => db.single<{paymentId: number, totalPaid: number}>(
      ' select coalesce(sum(p.amount), 0) totalPaid'
    + ' from payment p'
    + ' where p.customerId = @id',
      {id}, r => ({paymentId, totalPaid: r.totalpaid})))
    .mergeMap(({paymentId, totalPaid}) => db.single<ApiMakePaymentResponse>(
      ' select coalesce(sum(o.total), 0) totalOwed'
    + ' from historicOrder o'
    + ' where o.customerId = @id',
      {id}, r => {
        let totalOwed: number = r.totalowed;
        
        return {
          newCurrentBalance: totalPaid - totalOwed,
          newPastPaymentsTotal: totalPaid,
          newPastPayment: {
            id: paymentId,
            amount: request.amount,
            date: request.date,
            notes: request.notes
          }
        }
      }));
  }

  getCollectionPoints(id: number, db: Db): Observable<ApiCollectionPoint[]> {
    return db.all<ApiCollectionPoint>(
        ' select cp.id, cp.name'
      + ' from round_customer rc'
      + ' join collectionPoint cp on cp.roundId = rc.roundId'
      + ' where rc.customerId = @id'
      + ' order by cp.name', {id}, {},
      r => ({id: r.id, name: r.name}));
  }

  setCollectionPoint(id: number, params: any, db: Db): Observable<void> {
    return db.execute(
      ' update round_customer set collectionPointId = @collectionPointId'
    + ' where customerId = @id',
      {id, collectionPointId: params.collectionPointId})
  }
}

export class ApiPastOrder {
  id: number;
  date: Date;
  totalCost: number;
  boxes: ApiPastOrderItem[];
  extraProducts: ApiPastOrderItem[];
}

export class ApiPastOrderItem {
  name: string;
  price: number;
  quantity: number;
  unitType: string;
  totalCost: number;
}

export class ApiPastPayment {
  id: number;
  date: string;
  amount: number;
  notes: string;
}

export class ApiPastPayments {
  currentBalance: number;
  pastPaymentsTotal: number;
  pastPayments: ApiPastPayment[];
}

export class ApiMakePaymentRequest {
  date: string;
  amount: number;
  notes: string;
}

export class ApiMakePaymentResponse {
  newCurrentBalance: number;
  newPastPaymentsTotal: number;
  newPastPayment: ApiPastPayment;
}

export class ApiCollectionPoint {
  id: number;
  name: string;
}