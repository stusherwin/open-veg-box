import {Round} from './round'
import {RoundsService} from './rounds.service'
import {Objects} from '../shared/objects'
import {authorize} from '../auth/auth.middleware'

var express = require('express');

var app = express();

var roundsService = new RoundsService();

export let rounds = express.Router();

rounds.use(authorize);

rounds.get('/', function(req: any, res: any, next: any) {
  roundsService.getAll(Objects.whiteList(req.query, ['page', 'pageSize']), req.db)
               .subscribe(rounds => res.json(rounds), next);
});

rounds.get('/:id', function(req: any, res: any, next: any) {
  roundsService.get(req.params.id, req.db)
               .subscribe(round => res.json(round), next);
});

rounds.post('/:id', function(req: any, res: any, next: any) {
  roundsService.update(req.params.id, req.body, Objects.whiteList(req.query, ['page', 'pageSize']), req.db)
               .subscribe(rounds => res.json(rounds), next);
});

rounds.put('/', function(req: any, res: any, next: any) {
  roundsService.add(req.body, Objects.whiteList(req.query, ['page', 'pageSize']), req.db)
               .subscribe(rounds => res.json(rounds), next);
});

rounds.delete('/:id', function(req: any, res: any, next: any) {
  roundsService.delete(req.params.id, Objects.whiteList(req.query, ['page', 'pageSize']), req.db)
               .subscribe(rounds => res.json(rounds), next);
});

rounds.put('/:id/customers/:customerId', function(req: any, res: any, next: any) {
  roundsService.addCustomer(req.params.id, req.params.customerId, Objects.whiteList(req.query, ['page', 'pageSize']), req.db)
               .subscribe(rounds => res.json(rounds), next);
});

rounds.delete('/:id/customers/:customerId', function(req: any, res: any, next: any) {
  roundsService.removeCustomer(req.params.id, req.params.customerId, Objects.whiteList(req.query, ['page', 'pageSize']), req.db)
               .subscribe(rounds => res.json(rounds), next);
});