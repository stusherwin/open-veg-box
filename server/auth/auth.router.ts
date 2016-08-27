import {User} from './user'
import {AuthenticationService} from './authentication.service'
import 'rxjs/add/observable/of';
import {makeWl} from '../shared/helpers'

var express = require('express');

var app = express();

var authService = new AuthenticationService();

export let auth = express.Router();

auth.get('/current-user', function(req: any, res: any) {
  authService.getCurrentUser()
              .map(makeWl(['username', 'name']))
              .subscribe(user => res.json(user));
});

auth.post('/login', function(req: any, res: any) {
  authService.login(req.body)
              .map(makeWl(['username', 'name']))
              .subscribe(user => res.json(user));
});

auth.post('/logout', function(req: any, res: any) {
  authService.logout()
              .map(makeWl(['username', 'name']))
              .subscribe(user => res.json(user));
});