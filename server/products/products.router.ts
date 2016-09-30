import {Product} from './product'
import {ProductsService} from './products.service'
import {wl} from '../shared/helpers'
import {authorize} from '../auth/auth.middleware'

var express = require('express');

var app = express();

var productsService = new ProductsService();

export let products = express.Router();

products.use(authorize);

products.get('/', function(req: any, res: any) {
  productsService.getAll(wl(['page', 'pageSize'], req.query), req.db)
                 .subscribe(products => res.json(products));
});

products.post('/:id', function(req: any, res: any) {
  productsService.update(req.params.id, req.body, wl(['page', 'pageSize'], req.query), req.db)
                 .subscribe(products => res.json(products));
});

products.put('/', function(req: any, res: any) {
  productsService.add(req.body, wl(['page', 'pageSize'], req.query), req.db)
                 .subscribe(products => res.json(products));
});

products.delete('/:id', function(req: any, res: any) {
  productsService.delete(req.params.id, wl(['page', 'pageSize'], req.query), req.db)
                 .subscribe(products => res.json(products));
});