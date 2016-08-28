import {AuthenticationService} from './authentication.service'

var express = require('express');

var app = express();

var authService = new AuthenticationService();

export let auth = express.Router();

auth.post('/login', function(req: any, res: any) {
  authService.login(req.body)
             .subscribe(session => res.json(session), e => res.status(401));
});

auth.post('/logout/:token', function(req: any, res: any) {
  authService.logout(req.params.token)
             .subscribe(result => res.json(result));
});