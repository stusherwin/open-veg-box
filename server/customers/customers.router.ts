import {Customer} from './customer'
import {CustomersService} from './customers.service'
import {wl} from '../shared/helpers'

var express = require('express');

var app = express();

var customersService = new CustomersService();

export let customers = express.Router();

customers.get('/', function(req: any, res: any) {
  var customers = customersService.getAll(wl(['page', 'pageSize'], req.query));

  res.json(customers);
});

customers.post('/:id', function(req: any, res: any) {
  var customers = customersService.update(req.params.id, req.body, wl(['page', 'pageSize'], req.query));

  if (customers) {
    res.json(customers);
  } else {
    res.sendStatus(404);
  }
});

customers.put('/', function(req: any, res: any) {
  var customers = customersService.add(req.body, wl(['page', 'pageSize'], req.query));
  res.json(customers);
});