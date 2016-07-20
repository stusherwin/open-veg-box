import {Product} from './product'
import {ProductsService} from './products.service'

var express = require('express');

var app = express();

var productsService = new ProductsService();

export let products = express.Router();

products.get('/', function(req: any, res: any) {
  var products = productsService.getAll();

  res.json(products);
});

products.get('/:id', function(req: any, res: any) {
  var product = productsService.get(req.params.id);

  if (product) {
    res.json(product);
  } else {
    res.sendStatus(404);
  }
});

products.post('/:id', function(req: any, res: any) {
  var product = productsService.update(req.params.id,
    new Product(req.body.id, req.body.name, req.body.price, req.body.unitType, req.body.unitQuantity) );

  if (product) {
    res.json(product);
  } else {
    res.sendStatus(404);
  }
});

products.put('/', function(req: any, res: any) {
  var product = productsService.add(new Product(req.body.id, req.body.name, req.body.price, req.body.unitType, req.body.unitQuantity));
  if (product) {
    res.json(product);
  } else {
    res.sendStatus(404);
  }
});