import {AuthenticationService} from './authentication.service'

var express = require('express');

var app = express();

var authService = new AuthenticationService();

export let auth = express.Router();

auth.post('/login', function(req: any, res: any) {
  authService.login(req.body.username, req.body.password)
             .subscribe(user => res.json(user), e => {
                res.set('WWW-Authenticate', 'X-Basic realm="Restricted Area"');
                res.sendStatus(401)
             });
});

auth.post('/logout', function(req: any, res: any) {
  res.set('WWW-Authenticate', 'X-Basic realm="Restricted Area"');
  res.sendStatus(401);
  // authService.logout(req.params.token)
  //            .subscribe(result => res.json(result));
});