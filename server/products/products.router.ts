import {Product} from './product'
import {ProductsService} from './products.service'
import {Objects} from '../shared/objects'

var express = require('express');

export let getProducts = function(authorize: (req: any, res: any, next:() => void) => void): any {
  let productsService = new ProductsService();

  let products = express.Router();

  products.use(authorize);

  products.get('/', function(req: any, res: any, next: any) {
    productsService.getAll(req.query, req.db)
                   .subscribe(products => res.json(products), next);
  });

  products.post('/:id', function(req: any, res: any, next: any) {
    productsService.update(req.params.id, req.body, req.db)
                   .subscribe(() => res.sendStatus(200), next);
  });

  products.put('/', function(req: any, res: any, next: any) {
    productsService.add(req.body, req.db)
                   .subscribe(id => res.json({id}), next);
  });

  products.delete('/:id', function(req: any, res: any, next: any) {
    productsService.delete(req.params.id, req.db)
                   .subscribe(() => res.sendStatus(200), next);
  });

  return products;
};