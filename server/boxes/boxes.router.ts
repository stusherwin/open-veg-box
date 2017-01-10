import {Box, BoxProduct} from './box'
import {BoxesService} from './boxes.service'
import {Objects} from '../shared/objects'
import {authorize} from '../auth/auth.middleware'

var express = require('express');

var app = express();

var boxesService = new BoxesService();

export let boxes = express.Router();

boxes.use(authorize);

boxes.get('/', function(req: any, res: any, next: any) {
  boxesService.getAll(Objects.whiteList(req.query, ['page', 'pageSize']), req.db)
              .subscribe(boxes => res.json(boxes), next);
});

boxes.post('/:id', function(req: any, res: any, next: any) {
  boxesService.update(req.params.id, req.body, Objects.whiteList(req.query, ['page', 'pageSize']), req.db)
              .subscribe(boxes => res.json(boxes), next);
});

boxes.put('/', function(req: any, res: any, next: any) {
  boxesService.add(req.body, Objects.whiteList(req.query, ['page', 'pageSize']), req.db)
              .subscribe(boxes => res.json(boxes), next);
});

boxes.delete('/:id', function(req: any, res: any, next: any) {
  boxesService.delete(req.params.id, Objects.whiteList(req.query, ['page', 'pageSize']), req.db)
              .subscribe(boxes => res.json(boxes), next);
});

boxes.put('/:id/products/:productId', function(req: any, res: any, next: any) {
  boxesService.addProduct(req.params.id, req.params.productId, Objects.whiteList(req.query, ['page', 'pageSize']), req.db)
              .subscribe(boxes => res.json(boxes), next);
});

boxes.delete('/:id/products/:productId', function(req: any, res: any, next: any) {
  boxesService.removeProduct(req.params.id, req.params.productId, Objects.whiteList(req.query, ['page', 'pageSize']), req.db)
              .subscribe(boxes => res.json(boxes), next);
});