import {Customer} from './customer'
import {CustomersService} from './customers.service'
import {wl} from '../shared/helpers'
import {authorize} from '../auth/auth.middleware'

var express = require('express');

var app = express();

var customersService = new CustomersService();

export let customers = express.Router();

customers.use(authorize);

customers.get('/', function(req: any, res: any) {
  customersService.getAll(wl(['page', 'pageSize'], req.query), req.db)
                  .subscribe(customers => res.json(customers));
});

customers.post('/:id', function(req: any, res: any) {
  customersService.update(req.params.id, req.body, wl(['page', 'pageSize'], req.query), req.db)
                  .subscribe(customers => res.json(customers));
});

customers.put('/', function(req: any, res: any) {
  customersService.add(req.body, wl(['page', 'pageSize'], req.query), req.db)
                  .subscribe(customers => res.json(customers));
});