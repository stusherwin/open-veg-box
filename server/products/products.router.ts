import {Product} from './product'
import {ProductsService} from './products.service'
import {wl} from '../shared/helpers'

var express = require('express');

var app = express();

var productsService = new ProductsService();

export let products = express.Router();

products.get('/', function(req: any, res: any) {
  productsService.getAll(wl(['page', 'pageSize'], req.query))
                 .subscribe(products => res.json(products));
});

products.post('/:id', function(req: any, res: any) {
  productsService.update(req.params.id, req.body, wl(['page', 'pageSize'], req.query))
                 .subscribe(products => res.json(products));

  // if (products) {
  //   res.json(products);
  // } else {
  //   res.sendStatus(404);
  // }
});

products.put('/', function(req: any, res: any) {
  productsService.add(req.body, wl(['page', 'pageSize'], req.query))
                 .subscribe(products => res.json(products));
});