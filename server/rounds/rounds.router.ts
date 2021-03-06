import {Round} from './round'
import {RoundsService} from './rounds.service'
import {Objects} from '../shared/objects'

var express = require('express');

export let getRounds = function(authorize: (req: any, res: any, next:() => void) => void): any {
  let roundsService = new RoundsService();

  let rounds = express.Router();

  rounds.use(authorize);

  rounds.get('/', function(req: any, res: any, next: any) {
    roundsService.getAll(req.query, req.db)
                 .subscribe(rounds => res.json(rounds), next);
  });

  rounds.get('/:id', function(req: any, res: any, next: any) {
    roundsService.get(req.params.id, req.db)
                 .subscribe(round => res.json(round), next);
  });

  rounds.get('/:id/product_list', function(req: any, res: any, next: any) {
    roundsService.getProductList(req.params.id, req.db)
                 .subscribe(products => res.json(products), next);
  });

  rounds.get('/:id/order_list', function(req: any, res: any, next: any) {
    roundsService.getOrderList(req.params.id, req.db)
                 .subscribe(products => res.json(products), next);
  });

  rounds.get('/:id/deliveries/:deliveryId', function(req: any, res: any, next: any) {
    // res.sendStatus(404);
    roundsService.getDelivery(req.params.id, req.params.deliveryId, req.db)
                 .subscribe(delivery => res.json(delivery), next);
  });

  rounds.get('/:id/deliveries/:deliveryId/product_list', function(req: any, res: any, next: any) {
    roundsService.getDeliveryProductList(req.params.deliveryId, req.db)
                 .subscribe(products => res.json(products), next);
  });

  rounds.get('/:id/deliveries/:deliveryId/order_list', function(req: any, res: any, next: any) {
    roundsService.getDeliveryOrderList(req.params.deliveryId, req.db)
                 .subscribe(orders => res.json(orders), next);
  });

  rounds.post('/:id', function(req: any, res: any, next: any) {
    roundsService.update(req.params.id, req.body, req.db)
                 .subscribe(() => res.sendStatus(200), next);
  });

  rounds.put('/', function(req: any, res: any, next: any) {
    roundsService.add(req.body, req.db)
                 .subscribe(id => res.json({id}), next);
  });

  rounds.delete('/:id', function(req: any, res: any, next: any) {
    roundsService.delete(req.params.id, req.db)
                 .subscribe(() => res.sendStatus(200), next);
  });

  rounds.put('/:id/customers/:customerId', function(req: any, res: any, next: any) {
    roundsService.addCustomer(req.params.id, req.params.customerId, req.db)
                 .subscribe(() => res.sendStatus(200), next);
  });

  rounds.delete('/:id/customers/:customerId', function(req: any, res: any, next: any) {
    roundsService.removeCustomer(req.params.id, req.params.customerId, req.db)
                 .subscribe(() => res.sendStatus(200), next);
  });

  rounds.post('/:id/customers/:customerId/excludeFromNextDelivery', function(req: any, res: any, next: any) {
    roundsService.excludeCustomerFromNextDelivery(req.params.id, req.params.customerId, req.db)
                 .subscribe(() => res.sendStatus(200), next);
  });

  rounds.post('/:id/customers/:customerId/includeInNextDelivery', function(req: any, res: any, next: any) {
    roundsService.includeCustomerInNextDelivery(req.params.id, req.params.customerId, req.db)
                 .subscribe(() => res.sendStatus(200), next);
  });

  rounds.put('/:id/deliveries', function(req: any, res: any, next: any) {
    roundsService.createDelivery(req.params.id, req.db)
                 .subscribe(result => res.json(result), next);
  });

  rounds.delete('/:id/deliveries/:deliveryId', function(req: any, res: any, next: any) {
    roundsService.cancelDelivery(req.params.deliveryId, req.db)
                 .subscribe(() => res.sendStatus(200), next);
  });

  rounds.get('/:id/collection-points/', function(req: any, res: any, next: any) {
    roundsService.getCollectionPoints(req.params.id, req.db)
                 .subscribe(result => res.json(result), next);
  });

  rounds.put('/:id/collection-points/', function(req: any, res: any, next: any) {
    roundsService.addCollectionPoint(req.params.id, req.body, req.db)
                 .subscribe(id => res.json({id}), next);
  });

  rounds.post('/:id/collection-points/:collectionPointId', function(req: any, res: any, next: any) {
    roundsService.updateCollectionPoint(req.params.id, req.params.collectionPointId, req.body, req.db)
                 .subscribe(() => res.sendStatus(200), next);
  });

  rounds.delete('/:id/collection-points/:collectionPointId', function(req: any, res: any, next: any) {
    roundsService.removeCollectionPoint(req.params.id, req.params.collectionPointId, req.db)
                 .subscribe(() => res.sendStatus(200), next);
  });

  return rounds;
};