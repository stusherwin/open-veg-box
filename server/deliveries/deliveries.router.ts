import {Delivery} from './delivery'
import {DeliveriesService} from './deliveries.service'
import {wl} from '../shared/helpers'
import {authorize} from '../auth/auth.middleware'

var express = require('express');

var app = express();

var deliveriesService = new DeliveriesService();

export let deliveries = express.Router();

deliveries.use(authorize);

deliveries.get('/', function(req: any, res: any) {
  deliveriesService.getAll(wl(['page', 'pageSize'], req.query), req.db)
                  .subscribe(deliveries => res.json(deliveries));
});

deliveries.post('/:id', function(req: any, res: any) {
  deliveriesService.update(req.params.id, req.body, wl(['page', 'pageSize'], req.query), req.db)
                  .subscribe(deliveries => res.json(deliveries));
});

deliveries.put('/', function(req: any, res: any) {
  deliveriesService.add(req.body, wl(['page', 'pageSize'], req.query), req.db)
                  .subscribe(deliveries => res.json(deliveries));
});

deliveries.delete('/:id', function(req: any, res: any) {
  deliveriesService.delete(req.params.id, wl(['page', 'pageSize'], req.query), req.db)
                  .subscribe(deliveries => res.json(deliveries));
});