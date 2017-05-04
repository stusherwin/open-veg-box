import {Round, RoundCustomer} from './round'
import {ProductQuantity} from '../products/product'
import {Observable} from 'rxjs/Observable';
import {Db} from '../shared/db';
import 'rxjs/add/operator/mergeMap';
let _ = require('lodash');

export class RoundsService {
  getAll(queryParams: any, db: Db): Observable<Round[]> {
    return db.allWithReduce<Round>(
      ' select r.id, r.name, c.id customerId, (c.firstName || \' \' || c.surname) customerName, c.address customerAddress, c.email customerEmail from round r' 
    + ' left join round_customer rc on rc.roundId = r.id'
    + ' left join customer c on c.id = rc.customerId'
    + ' order by r.id, c.surname, c.firstname',
      {},
      queryParams,
      rows => {
        let rounds: { [id: number]: Round; } = {};
        for(let r of rows) {
          if(!rounds[r.id]) {
            rounds[r.id] = new Round(r.id, r.name, []);
          }
          if(r.customerid) {
            rounds[r.id].customers.push(new RoundCustomer(r.customerid, r.customername, r.customeraddress, r.customeremail));
          }
        }
        let result: Round[] = [];
        for(let id in rounds) {
          result.push(rounds[id]);
        }
        return result;
      });
  }

  get(id: number, db: Db): Observable<Round> {
    return db.singleWithReduce<Round>(
      ' select r.id, r.name, c.id customerId, c.firstName || \' \' || c.surname customerName, c.address customerAddress, c.email customerEmail from round r' 
    + ' left join round_customer rc on rc.roundId = r.id'
    + ' left join customer c on c.id = rc.customerId'
    + ' where r.id = @id'
    + ' order by r.id, c.surname, c.firstname',
      {id: id},
      rows => {
        let round: Round = null;
        for(let r of rows) {
          if(!round) {
            round = new Round(r.id, r.name, []);
          }
          if(r.customerid) {
            round.customers.push(new RoundCustomer(r.customerid, r.customername, r.customeraddress, r.customeremail));
          }
        }
        return round;
      });
  }

  getProductList(id: number, db: Db): Observable<ProductList> {
    return db.singleWithReduce<ProductList>(
      ' select customerId, customerName, address, productId, productName, unittype, sum(quantity) quantity from'
    + ' (select c.id customerId, c.firstName || \' \' || c.surname customerName, c.address, p.id productId, p.name productName, p.unitType, op.quantity'
    + ' from round r'
    + ' inner join round_customer rc on rc.roundId = r.id'
    + ' inner join customer c on c.id = rc.customerId'
    + ' inner join [order] o on o.customerId = c.id'
    + ' inner join order_product op on op.orderId = o.id'
    + ' inner join product p on p.id = op.productId'
    + ' where r.id = @id'
    + ' union'
    + ' select c.id customerId, c.firstName || \' \' || c.surname customerName, c.address, p.id productId, p.name productName, p.unitType, bp.quantity'
    + ' from round r'
    + ' inner join round_customer rc on rc.roundId = r.id'
    + ' inner join customer c on c.id = rc.customerId'
    + ' inner join [order] o on o.customerId = c.id'
    + ' inner join order_box ob on ob.orderId = o.id'
    + ' inner join box b on b.id = ob.boxId'
    + ' inner join box_product bp on bp.boxId = b.id'
    + ' inner join product p on p.id = bp.productId'
    + ' where r.id = @id) x'
    + ' group by customerId, customerName, address, productId, productName, unitType'
    + ' order by customerName, productName',
      {id}, rows => {
        let customers = {};
        let products = {};
        for(let r of rows) {
          if(!customers[r.customerid]) {
            customers[r.customerid] = {
              id: r.customerid,
              name: r.customername,
              address: r.address,
              products: []
            }
          }
          customers[r.customerid].products.push(new ProductQuantity(r.productid, r.productname, r.quantity, r.unittype));
          if(!products[r.productid]) {
            products[r.productid] = new ProductQuantity(r.productid, r.productname, r.quantity, r.unittype);
          } else {
            products[r.productid].quantity += r.quantity;
          }
        }

        let t = _.chain(products)
                 .values()
                 .sortBy('name')
                 .value();

        let c = _.chain(customers)
                 .values()
                 .forEach((c: CustomerProductList) => {
                   _.sortBy(c.products, 'name');
                 })
                 .sortBy('name')
                 .value()
        return {totals: t, customers: c};
      });
  }

  getOrderList(id: number, db: Db): Observable<CustomerOrderList> {
    return db.singleWithReduce<CustomerOrderList>(
      ' select customerId, customerName, address, itemType, itemId, itemName, price, quantity, unittype, totalCost from'
    + ' (select c.id customerId, c.firstName || \' \' || c.surname customerName, c.address, \'product\' itemType, p.id itemId, p.name itemName, p.price, p.unitType, op.quantity, p.price * op.quantity totalCost'
    + ' from round r'
    + ' inner join round_customer rc on rc.roundId = r.id'
    + ' inner join customer c on c.id = rc.customerId'
    + ' inner join [order] o on o.customerId = c.id'
    + ' inner join order_product op on op.orderId = o.id'
    + ' inner join product p on p.id = op.productId'
    + ' where r.id = @id'
    + ' union'
    + ' select c.id customerId, c.firstName || \' \' || c.surname customerName, c.address, \'box\' itemType, b.id itemId, b.name itemName, b.price, \'each\' unitType, ob.quantity, b.price * ob.quantity totalCost'
    + ' from round r'
    + ' inner join round_customer rc on rc.roundId = r.id'
    + ' inner join customer c on c.id = rc.customerId'
    + ' inner join [order] o on o.customerId = c.id'
    + ' inner join order_box ob on ob.orderId = o.id'
    + ' inner join box b on b.id = ob.boxId'
    + ' where r.id = @id) x'
    + ' order by customerName, itemType, itemName',
      {id}, rows => {
        let customers = {};
        for(let r of rows) {
          if(!customers[r.customerid]) {
            customers[r.customerid] = {
              id: r.customerid,
              name: r.customername,
              address: r.address,
              boxes: [],
              extraProducts: []
            }
          }

          let item = {
            id: r.itemid,
            name: r.itemname,
            price: r.price,
            quantity: r.quantity,
            unitType: r.unittype,
            totalCost: r.totalcost
          };
          if(r.itemtype == 'box') {
            customers[r.customerid].boxes.push(item);
          } else {
            customers[r.customerid].extraProducts.push(item);
          }
        }

        let orders =
         _.chain(customers)
          .values()
          .forEach((c: CustomerOrder) => {
            _.sortBy(c.boxes, 'name');
            _.sortBy(c.extraProducts, 'name');
            c.totalCost = _.chain(c.boxes).concat(c.extraProducts).sumBy('totalCost').value();
          })
          .sortBy('name')
          .value();

        let totalCost = _.sumBy(orders, 'totalCost');

        return ({ orders, totalCost });
    });
  }

  add(params: any, queryParams: any, db: Db): Observable<Round[]> {
    return db.insert('round', ['name'], params)
      .mergeMap(() => this.getAll(queryParams, db));
  }

  update(id: number, params: any, queryParams: any, db: Db): Observable<Round[]> {
    return db.update('round', ['name'], id, params)
      .mergeMap(() => this.getAll(queryParams, db));
  }

  delete(id: number, queryParams: any, db: Db): Observable<Round[]> {
    return db.execute('delete from round_customer where roundId = @id', {id})
      .mergeMap(() => db.delete('round', id))
      .mergeMap(() => this.getAll(queryParams, db));
  }

  addCustomer(id: number, customerId: number, queryParams: any, db: Db): Observable<Round[]> {
    return db.execute('insert into round_customer (roundId, customerId) values (@id, @customerId)',
        {id, customerId})
      .mergeMap(() => this.getAll(queryParams, db));
  }
  
  removeCustomer(id: number, customerId: number, queryParams: any, db: Db): Observable<Round[]> {
    return db.execute('delete from round_customer where roundId = @id and customerId = @customerId',
        {id, customerId})
      .mergeMap(() => this.getAll(queryParams, db));
  }
}

export class ProductList {
  totals: ProductQuantity[];
  customers: CustomerProductList[];
}

export class CustomerProductList {
  id: number;
  name: string;
  address: string;
  products: ProductQuantity[]
}

export class CustomerOrderList {
  totalCost: number;
  orders: CustomerOrder[];
}

export class CustomerOrder {
  id: number;
  name: string;
  address: string;
  totalCost: number;
  boxes: CustomerOrderItem[];
  extraProducts: CustomerOrderItem[];
}

export class CustomerOrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  unitType: string;
  totalCost: number;
}