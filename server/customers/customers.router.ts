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

customers.get('/no_round', function(req: any, res: any) {
  customersService.getAllWithNoRound(wl(['page', 'pageSize'], req.query), req.db)
                  .subscribe(rounds => res.json(rounds));
});

customers.post('/:id', function(req: any, res: any) {
  customersService.update(req.params.id, req.body, wl(['page', 'pageSize'], req.query), req.db)
                  .subscribe(customers => res.json(customers));
});

customers.put('/', function(req: any, res: any) {
  customersService.add(req.body, wl(['page', 'pageSize'], req.query), req.db)
                  .subscribe(customers => res.json(customers));
});

customers.delete('/:id', function(req: any, res: any) {
  customersService.delete(req.params.id, wl(['page', 'pageSize'], req.query), req.db)
                  .subscribe(customers => res.json(customers));
});