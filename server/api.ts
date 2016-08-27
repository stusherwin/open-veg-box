var express = require('express');

import {products} from './products/products.router'
import {customers} from './customers/customers.router'
import {users} from './users/users.router'

var app = express();
  
export let api = express.Router();

api.use('/products', products);
api.use('/customers', customers);
api.use('/users', users);

api.all('/*', function(req: any, res: any) {
  res.sendStatus(404);
});