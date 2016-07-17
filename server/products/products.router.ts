import {Product, UnitType} from './product'
import {ProductsService} from './products.service'

var express = require('express');
var app = express();

var productService = new ProductsService();

export let products = express.Router();

products.get('/', function(req: any, res: any) {
  var products = productService.getAll();

  res.type('json');
  res.send(JSON.stringify(products));
});

products.get('/:id', function(req: any, res: any) {
  var product = productService.get(req.params.id);

  if (product) {
    res.type('json');
    res.send(JSON.stringify(product));
  } else {
    res.sendStatus(404);
  }
});