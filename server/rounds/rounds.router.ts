import {Round} from './round'
import {RoundsService} from './rounds.service'
import {Objects} from '../shared/objects'
import {authorize} from '../auth/auth.middleware'

var express = require('express');

var app = express();

var roundsService = new RoundsService();

export let rounds = express.Router();

rounds.use(authorize);

rounds.get('/', function(req: any, res: any) {
  roundsService.getAll(Objects.whiteList(req.query, ['page', 'pageSize']), req.db)
               .subscribe(rounds => res.json(rounds));
});

rounds.get('/:id', function(req: any, res: any) {
  roundsService.get(req.params.id, req.db)
               .subscribe(rounds => res.json(rounds));
});

rounds.post('/:id', function(req: any, res: any) {
  roundsService.update(req.params.id, req.body, Objects.whiteList(req.query, ['page', 'pageSize']), req.db)
               .subscribe(rounds => res.json(rounds));
});

rounds.put('/', function(req: any, res: any) {
  roundsService.add(req.body, Objects.whiteList(req.query, ['page', 'pageSize']), req.db)
               .subscribe(rounds => res.json(rounds));
});

rounds.delete('/:id', function(req: any, res: any) {
  roundsService.delete(req.params.id, Objects.whiteList(req.query, ['page', 'pageSize']), req.db)
               .subscribe(rounds => res.json(rounds));
});

rounds.put('/:id/customers/:customerId', function(req: any, res: any) {
  roundsService.addCustomer(req.params.id, req.params.customerId, Objects.whiteList(req.query, ['page', 'pageSize']), req.db)
               .subscribe(rounds => res.json(rounds));
});

rounds.delete('/:id/customers/:customerId', function(req: any, res: any) {
  roundsService.removeCustomer(req.params.id, req.params.customerId, Objects.whiteList(req.query, ['page', 'pageSize']), req.db)
               .subscribe(rounds => res.json(rounds));
});