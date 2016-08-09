import {Customer} from './customer'
import {CustomersService} from './customers.service'

var express = require('express');

var app = express();

var customersService = new CustomersService();

export let customers = express.Router();

var whiteList = function(query: any) {
  return { page: query.page, pageSize: query.pageSize };
}

customers.get('/', function(req: any, res: any) {
  var customers = customersService.getAll(whiteList(req.query));

  res.json(customers);
});

customers.post('/:id', function(req: any, res: any) {
  var customers = customersService.update(req.params.id, req.body, whiteList(req.query));

  if (customers) {
    res.json(customers);
  } else {
    res.sendStatus(404);
  }
});

customers.put('/', function(req: any, res: any) {
  var customers = customersService.add(req.body, whiteList(req.query));
  res.json(customers);
});