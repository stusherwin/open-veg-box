import {Round, RoundCustomer, Delivery} from './round'
import {ProductQuantity} from '../products/product'
import {Observable} from 'rxjs/Observable';
import {Db} from '../shared/db';
import 'rxjs/add/operator/mergeMap';
let _ = require('lodash');

export class RoundsService {
  getAll(queryParams: any, db: Db): Observable<Round[]> {
    return db.allWithReduce<Round>(
      ' select r.id, r.name, r.deliveryWeekday, r.nextDeliveryDate, c.id customerId, (c.firstName || \' \' || c.surname) customerName, c.address customerAddress, c.email customerEmail,'
    + ' rc.excludedFromNextDelivery'  
    + ' from round r' 
    + ' left join round_customer rc on rc.roundId = r.id'
    + ' left join customer c on c.id = rc.customerId'
    + ' order by r.name, c.surname, c.firstname',
      {},
      queryParams,
      rows => {
        let rounds: Round[] = [];
        for(let r of rows) {
          let round = rounds.find(rnd => rnd.id == r.id);
          if(!round) {
            round = new Round(r.id, r.name, r.deliveryweekday, r.nextdeliverydate, [], []);
            rounds.push(round);
          }
          if(r.customerid) {
            round.customers.push(new RoundCustomer(r.customerid, r.customername, r.customeraddress, r.customeremail, r.excludedfromnextdelivery));
          }
        }

        return rounds;
      });
  }

  get(id: number, db: Db): Observable<Round> {
    return db.singleWithReduce<Round>(
      ' select'
    + ' r.id, r.name, r.deliveryWeekday, r.nextDeliveryDate,'
    + ' c.id customerId, c.firstName || \' \' || c.surname customerName, c.address customerAddress, c.email customerEmail,'
    + ' d.id deliveryId, d.date deliveryDate,'
    + ' rc.excludedFromNextDelivery'
    + ' from round r' 
    + ' left join round_customer rc on rc.roundId = r.id'
    + ' left join customer c on c.id = rc.customerId'
    + ' left join delivery d on d.roundId = r.id'
    + ' where r.id = @id'
    + ' order by r.id, c.surname, c.firstname, d.date desc',
      {id: id},
      rows => {
        let round: Round = null;
        for(let r of rows) {
          if(!round) {
            round = new Round(r.id, r.name, r.deliveryweekday, r.nextdeliverydate, [], []);
          }
          if(r.customerid && !round.customers.find(c => c.id == r.customerid)) {
            round.customers.push(new RoundCustomer(r.customerid, r.customername, r.customeraddress, r.customeremail, r.excludedfromnextdelivery));
          }
          if(r.deliveryid && !round.deliveries.find(d => d.id == r.deliveryid)) {
            round.deliveries.push(new Delivery(r.deliveryid, r.id, r.deliverydate));
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
      ' select customerId, customerName, address, itemType, itemId, itemName, price, quantity, unittype, totalCost, excluded from'
    + ' (select c.id customerId, c.firstName || \' \' || c.surname customerName, c.address, \'product\' itemType, p.id itemId, p.name itemName, p.price, p.unitType, op.quantity, p.price * op.quantity totalCost,'
    + ' rc.excludedFromNextDelivery excluded'
    + ' from round r'
    + ' inner join round_customer rc on rc.roundId = r.id'
    + ' inner join customer c on c.id = rc.customerId'
    + ' inner join [order] o on o.customerId = c.id'
    + ' inner join order_product op on op.orderId = o.id'
    + ' inner join product p on p.id = op.productId'
    + ' where r.id = @id'
    + ' union'
    + ' select c.id customerId, c.firstName || \' \' || c.surname customerName, c.address, \'box\' itemType, b.id itemId, b.name itemName, b.price, \'each\' unitType, ob.quantity, b.price * ob.quantity totalCost,'
    + ' rc.excludedFromNextDelivery excluded'
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
              extraProducts: [],
              excluded: r.excluded
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

        let orders: CustomerOrder[] =
         _.chain(customers)
          .values()
          .forEach((c: CustomerOrder) => {
            _.sortBy(c.boxes, 'name');
            _.sortBy(c.extraProducts, 'name');
            c.totalCost = _.chain(c.boxes).concat(c.extraProducts).sumBy('totalCost').value();
          })
          .sortBy('name')
          .value();

        let totalCost = orders.reduce((s, o) => s + (o.excluded? 0 : o.totalCost), 0);

        return ({ orders, totalCost });
    });
  }

  getDelivery(roundId: number, deliveryId: number, db: Db): Observable<Delivery> {
    return db.singleWithReduce<Delivery>(
      ' select'
    + ' d.id, d.roundId, d.date'
    + ' from delivery d'
    + ' where d.roundId = @roundId and d.id = @deliveryId',
      {roundId, deliveryId},
      rows => {
        let delivery: Delivery = null;
        for(let r of rows) {
          if(!delivery) {
            delivery = new Delivery(r.id, r.roundid, r.date);
          }
        }

        return delivery;
      });
  }

  getDeliveryProductList(deliveryId: number, db: Db): Observable<ProductList> {
    return db.singleWithReduce<ProductList>(
      ' select customerId, customerName, address, productId, productName, unittype, sum(quantity) quantity from'
    + ' (select \'boxProduct\' type, c.id customerId, c.firstName || \' \' || c.surname customerName, c.address,'
    + ' hop.productId, hop.name productName, hop.unitType, hop.quantity'
    + ' from historicOrder ho'
    + ' inner join customer c on c.id = ho.customerId'
    + ' inner join historicOrderedProduct hop on hop.orderId = ho.id'
    + ' where ho.deliveryId = @deliveryId'
    + ' union'
    + ' select \'product\' type, c.id customerId, c.firstName || \' \' || c.surname customerName, c.address,'
    + ' hobp.productId, hobp.name productName, hobp.unitType, hobp.quantity'
    + ' from historicOrder ho'
    + ' inner join customer c on c.id = ho.customerId'
    + ' inner join historicOrderedBox hob on hob.orderId = ho.id'
    + ' inner join historicOrderedBoxProduct hobp on hobp.orderedBoxId = hob.id'
    + ' where ho.deliveryId = @deliveryId) x'
    + ' group by customerId, customerName, address, productId, productName, unitType'
    + ' order by customerName, productName',
      {deliveryId}, rows => {
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

  getDeliveryOrderList(deliveryId: number, db: Db): Observable<CustomerOrderList> {
    return db.singleWithReduce<CustomerOrderList>(
      ' select customerId, customerName, address, itemType, itemId, itemName, price, quantity, unittype, totalCost from'
    + ' (select c.id customerId, c.firstName || \' \' || c.surname customerName, c.address,'
    + ' \'product\' itemType, hop.productId itemId, hop.name itemName, hop.price, hop.unitType,'
    + ' hop.quantity, hop.price * hop.quantity totalCost'
    + ' from historicOrder ho'
    + ' inner join customer c on c.id = ho.customerId'
    + ' inner join historicOrderedProduct hop on hop.orderId = ho.id'
    + ' where ho.deliveryId = @deliveryId'
    + ' union'
    + ' select c.id customerId, c.firstName || \' \' || c.surname customerName, c.address,'
    + ' \'box\' itemType, hob.boxId itemId, hob.name itemName, hob.price, \'each\' unitType,'
    + ' hob.quantity, hob.price * hob.quantity totalCost'
    + ' from historicOrder ho'
    + ' inner join customer c on c.id = ho.customerId'
    + ' inner join historicOrderedBox hob on hob.orderId = ho.id'
    + ' where ho.deliveryId = @deliveryId) x'
    + ' order by customerName, itemType, itemName',
      {deliveryId}, rows => {
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

  add(params: any, db: Db): Observable<number> {
    return db.insert('round', ['name', 'deliveryWeekday'], params);
  }

  update(id: number, params: any, db: Db): Observable<void> {
    return db.update('round', ['name', 'deliveryWeekday', 'nextDeliveryDate'], id, params);
  }

  delete(id: number, db: Db): Observable<void> {
    return db.execute('delete from round_customer where roundId = @id', {id})
      .mergeMap(() => db.delete('round', id));
  }

  addCustomer(id: number, customerId: number, db: Db): Observable<void> {
    return db.execute('insert into round_customer (roundId, customerId) values (@id, @customerId)',
        {id, customerId});
  }
  
  removeCustomer(id: number, customerId: number, db: Db): Observable<void> {
    return db.execute('delete from round_customer where roundId = @id and customerId = @customerId',
        {id, customerId});
  }

  excludeCustomerFromNextDelivery(id: number, customerId: number, db: Db): Observable<void> {
    return db.execute('update round_customer set excludedFromNextDelivery = 1 where roundId = @id and customerId = @customerId',
        {id, customerId});
  }
  
  includeCustomerInNextDelivery(id: number, customerId: number, db: Db): Observable<void> {
    return db.execute('update round_customer set excludedFromNextDelivery = 0 where roundId = @id and customerId = @customerId',
        {id, customerId});
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
  excluded: boolean;
}

export class CustomerOrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  unitType: string;
  totalCost: number;
}