import {Customer} from './customer'
import {CustomersService} from './customers.service'
import {Objects} from '../shared/objects'
 
var express = require('express');

export let getCustomers = function(authorize: (req: any, res: any, next:() => void) => void): any {
  let customersService = new CustomersService();

  let customers = express.Router();

  customers.use(authorize);

  customers.get('/', function(req: any, res: any, next: any) {
    customersService.getAll(req.query, req.db)
                    .subscribe(customers => res.json(customers), next);
  });

  customers.get('/no_round', function(req: any, res: any, next: any) {
    customersService.getAllHavingNoRound(req.query, req.db)
                    .subscribe(customers => res.json(customers), next);
  });

  customers.get('/:id', function(req: any, res: any, next: any) {
    customersService.get(req.params.id, req.query, req.db)
                    .subscribe(customer => res.json(customer), next);
  });

  customers.get('/:id/past-orders', function(req: any, res: any, next: any) {
    customersService.getPastOrders(req.params.id, req.db)
                    .subscribe(orders => res.json(orders), next);
  });

  customers.get('/:id/past-payments', function(req: any, res: any, next: any) {
    customersService.getPastPayments(req.params.id, req.db)
                    .subscribe(payments => res.json(payments), next);
  });

  customers.post('/:id', function(req: any, res: any, next: any) {
    customersService.update(req.params.id, req.body, req.db)
                    .subscribe(() => res.sendStatus(200), next);
  });

  customers.put('/', function(req: any, res: any, next: any) {
    customersService.add(req.body, req.db)
                    .subscribe(id => res.json({id}), next);
  });

  customers.delete('/:id', function(req: any, res: any, next: any) {
    customersService.delete(req.params.id, req.db)
                    .subscribe(() => res.sendStatus(200), next);
  });

  customers.post('/:id/make-payment', function(req: any, res: any, next: any) {
    customersService.makePayment(req.params.id, req.body, req.db)
                    .subscribe(response => res.json(response), next);
  });

  return customers;
};