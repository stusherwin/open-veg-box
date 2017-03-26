import {Box} from './box'
import {ProductQuantity} from '../products/product'
import {BoxesService} from './boxes.service'
import {Objects} from '../shared/objects'

var express = require('express');

export let getBoxes = function(authorize: (req: any, res: any, next:() => void) => void): any {
  var boxesService = new BoxesService();

  let boxes = express.Router();
  boxes.use(authorize);

  boxes.get('/', function(req: any, res: any, next: any) {
    boxesService.getAll(req.query, req.db)
                .subscribe(boxes => res.json(boxes), next);
  });

  boxes.post('/:id', function(req: any, res: any, next: any) {
    boxesService.update(req.params.id, req.body, req.query, req.db)
                .subscribe(boxes => res.json(boxes), next);
  });

  boxes.put('/', function(req: any, res: any, next: any) {
    boxesService.add(req.body, req.query, req.db)
                .subscribe(boxes => res.json(boxes), next);
    });

  boxes.delete('/:id', function(req: any, res: any, next: any) {
    boxesService.delete(req.params.id, req.query, req.db)
                .subscribe(boxes => res.json(boxes), next);
  });

  boxes.put('/:id/products/:productId', function(req: any, res: any, next: any) {
    boxesService.addProduct(req.params.id, req.params.productId, req.body, req.query, req.db)
                .subscribe(boxes => res.json(boxes), next);
  });

  boxes.post('/:id/products/:productId', function(req: any, res: any, next: any) {
    boxesService.updateProduct(req.params.id, req.params.productId, req.body, req.query, req.db)
                .subscribe(boxes => res.json(boxes), next);
  });

  boxes.delete('/:id/products/:productId', function(req: any, res: any, next: any) {
    boxesService.removeProduct(req.params.id, req.params.productId, req.query, req.db)
                .subscribe(boxes => res.json(boxes), next);
  });

  return boxes; 
} 