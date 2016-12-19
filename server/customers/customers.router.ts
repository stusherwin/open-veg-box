import {Customer} from './customer'
import {CustomersService} from './customers.service'
import {Objects} from '../shared/objects'
import {authorize} from '../auth/auth.middleware'
 
var express = require('express');

var app = express();

var customersService = new CustomersService();

export let customers = express.Router();

customers.use(authorize);

customers.get('/', function(req: any, res: any, next: any) {
  customersService.getAll(Objects.whiteList(req.query, ['page', 'pageSize']), req.db)
                  .subscribe(customers => res.json(customers), next);
});

customers.get('/no_round', function(req: any, res: any, next: any) {
  customersService.getAllWithNoRound(Objects.whiteList(req.query, ['page', 'pageSize']), req.db)
                  .subscribe(customers => res.json(customers), next);
});

customers.get('/:id', function(req: any, res: any, next: any) {
  customersService.get(req.params.id, req.db)
                  .subscribe(customer => res.json(customer), next);
});

customers.post('/:id', function(req: any, res: any, next: any) {
  customersService.update(req.params.id, req.body, Objects.whiteList(req.query, ['page', 'pageSize']), req.db)
                  .subscribe(customers => res.json(customers), next);
});

customers.put('/', function(req: any, res: any, next: any) {
  customersService.add(req.body, Objects.whiteList(req.query, ['page', 'pageSize']), req.db)
                  .subscribe(customers => res.json(customers), next);
});

customers.delete('/:id', function(req: any, res: any, next: any) {
  customersService.delete(req.params.id, Objects.whiteList(req.query, ['page', 'pageSize']), req.db)
                  .subscribe(customers => res.json(customers), next);
});