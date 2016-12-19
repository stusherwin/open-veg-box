import {AuthenticationService} from './authentication.service'
import {User} from './user'

var express = require('express');

var app = express();

var authService = new AuthenticationService();

export let auth = express.Router();

auth.post('/login', function(req: any, res: any, next: any) {
  authService.authenticate(req.body.username, req.body.password)
             .subscribe(org => {
               if(org) {
                 res.json(new User(org.username, org.name));
               } else {
                 res.set('WWW-Authenticate', 'X-Basic realm="Restricted Area"');
                 res.sendStatus(401);
               }
             }, next);
});

auth.post('/logout', function(req: any, res: any) {
  res.set('WWW-Authenticate', 'X-Basic realm="Restricted Area"');
  res.sendStatus(401);
});