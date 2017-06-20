import {Db} from './shared/db'
import {PostgresDb} from './shared/postgresdb'
import {ConfigService} from './config/config.service'

import {getAuthorize} from './auth/auth.middleware'
import {getAuth} from './auth/auth.router'
import {getProducts} from './products/products.router'
import {getBoxes} from './boxes/boxes.router'
import {getCustomers} from './customers/customers.router'
import {getRounds} from './rounds/rounds.router'
import {getEmail} from './email/email.router'
import {getOrder} from './customers/order.router'

var express = require('express');

var config = new ConfigService();
var mainDb = new PostgresDb(config.connectionString);

export let api = express.Router();

mainDb.all<{id: number, db: Db}>(
' select o.id, o.dbType, o.connectionString'
+ ' from organisation o', {}, {}, r => {
  switch(r.dbtype) {
    case 'postgres':
      return {id: r.id, db: new PostgresDb(r.connectionstring)};
    default:
      return {id: r.id, db: null};
  }
})
.map(dbs => {
  let result:{[organisationId: number]: Db} = {};
  for(let db of dbs) {
    result[db.id] = db.db;
  }
  return result;
})
.subscribe(dbs => {
  let auth = getAuth(mainDb, dbs);
  let authorize = getAuthorize(mainDb, dbs);
  let products = getProducts(authorize);
  let boxes = getBoxes(authorize);
  let customers = getCustomers(authorize);
  let rounds = getRounds(authorize);
  let email = getEmail(config.email, authorize);
  let order = getOrder(authorize);

  api.use('/products', products);
  api.use('/boxes', boxes);
  api.use('/customers', customers);
  api.use('/order', order);
  api.use('/rounds', rounds);
  api.use('/email', email);
  api.use('/auth', auth);

  api.all('/*', function(req: any, res: any) {
    res.sendStatus(404);
  });
});