import {User} from './user'
import {UsersService} from './users.service'
import 'rxjs/add/observable/of';
import {makeWl} from '../shared/helpers'

var express = require('express');

var app = express();

var usersService = new UsersService();

export let users = express.Router();

users.get('/current', function(req: any, res: any) {
  usersService.getCurrent()
              .map(makeWl(['username', 'name']))
              .subscribe(user => res.json(user));
});

users.post('/login', function(req: any, res: any) {
  usersService.login(req.body)
              .map(makeWl(['username', 'name']))
              .subscribe(user => res.json(user));
});

users.post('/logout', function(req: any, res: any) {
  usersService.logout()
              .map(makeWl(['username', 'name']))
              .subscribe(user => res.json(user));
});