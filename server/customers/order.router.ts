import {CustomerOrder, CustomerOrderItem} from './customer'
import {OrderService} from './order.service'
import {Objects} from '../shared/objects'

var express = require('express');

export let getOrder = function(authorize: (req: any, res: any, next:() => void) => void): any {
  var orderService = new OrderService();

  let order = express.Router();
  order.use(authorize);

  order.get('/:id', function(req: any, res: any, next: any) {
    orderService.get(req.params.id, req.db)
                 .subscribe(order => res.json(order), next);
  });

  order.put('/:id/boxes/:boxId', function(req: any, res: any, next: any) {
    orderService.addBox(req.params.id, req.params.boxId, req.body, req.db)
                .subscribe(order => res.json(order), next);
  });

  order.post('/:id/boxes/:boxId', function(req: any, res: any, next: any) {
    orderService.updateBox(req.params.id, req.params.boxId, req.body, req.db)
                .subscribe(order => res.json(order), next);
  });

  order.delete('/:id/boxes/:boxId', function(req: any, res: any, next: any) {
    orderService.removeBox(req.params.id, req.params.boxId, req.db)
                .subscribe(order => res.json(order), next);
  });

  order.put('/:id/products/:productId', function(req: any, res: any, next: any) {
    orderService.addProduct(req.params.id, req.params.productId, req.body, req.db)
                .subscribe(order => res.json(order), next);
  });

  order.post('/:id/products/:productId', function(req: any, res: any, next: any) {
    orderService.updateProduct(req.params.id, req.params.productId, req.body, req.db)
                .subscribe(order => res.json(order), next);
  });

  order.delete('/:id/products/:productId', function(req: any, res: any, next: any) {
    orderService.removeProduct(req.params.id, req.params.productId, req.db)
                .subscribe(order => res.json(order), next);
  });

  return order; 
} 