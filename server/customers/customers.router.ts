import {Customer} from './customer'
import {CustomersService} from './customers.service'
import {Objects} from '../shared/objects'
import {authorize} from '../auth/auth.middleware'
 
var express = require('express');

var app = express();

var customersService = new CustomersService();

export let customers = express.Router();

customers.use(authorize);

customers.get('/', function(req: any, res: any) {
  customersService.getAll(Objects.whiteList(req.query, ['page', 'pageSize']), req.db)
                  .subscribe(customers => res.json(customers));
});

customers.get('/no_round', function(req: any, res: any) {
  customersService.getAllWithNoRound(Objects.whiteList(req.query, ['page', 'pageSize']), req.db)
                  .subscribe(customers => res.json(customers));
});

customers.get('/:id', function(req: any, res: any) {
  customersService.get(req.params.id, req.db)
                  .subscribe(customer => res.json(customer));
});

customers.post('/:id', function(req: any, res: any) {
  customersService.update(req.params.id, req.body, Objects.whiteList(req.query, ['page', 'pageSize']), req.db)
                  .subscribe(customers => res.json(customers));
});

customers.put('/', function(req: any, res: any) {
  customersService.add(req.body, Objects.whiteList(req.query, ['page', 'pageSize']), req.db)
                  .subscribe(customers => res.json(customers));
});

customers.delete('/:id', function(req: any, res: any) {
  customersService.delete(req.params.id, Objects.whiteList(req.query, ['page', 'pageSize']), req.db)
                  .subscribe(customers => res.json(customers));
});