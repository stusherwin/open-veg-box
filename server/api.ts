var express = require('express');

import {products} from './products/products.router'
import {boxes} from './boxes/boxes.router'
import {customers} from './customers/customers.router'
import {rounds} from './rounds/rounds.router'
import {email} from './email/email.router'
import {auth} from './auth/auth.router'

var app = express();
  
export let api = express.Router();

api.use('/products', products);
api.use('/boxes', boxes);
api.use('/customers', customers);
api.use('/rounds', rounds);
api.use('/email', email);
api.use('/auth', auth);

api.all('/*', function(req: any, res: any) {
  res.sendStatus(404);
});