import {Product} from './product'
import {ProductsService} from './products.service'

var express = require('express');

var app = express();

var productsService = new ProductsService();

export let products = express.Router();

var whiteList = function(query: any) {
  return { page: query.page, pageSize: query.pageSize };
}

products.get('/', function(req: any, res: any) {
  productsService.getAll(whiteList(req.query)).subscribe(products => res.json(products));
});

products.post('/:id', function(req: any, res: any) {
  productsService.update(req.params.id, req.body, whiteList(req.query)).subscribe(products => res.json(products));

  // if (products) {
  //   res.json(products);
  // } else {
  //   res.sendStatus(404);
  // }
});

products.put('/', function(req: any, res: any) {
  productsService.add(req.body, whiteList(req.query)).subscribe(products => res.json(products));
});