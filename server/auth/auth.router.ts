import {AuthenticationService} from './authentication.service'
import {User} from './user'
import {Db} from '../shared/db'

var express = require('express');

var app = express();

export let getAuth = function(mainDb: Db, dbs: {[organisationId: number]: Db}): any {
  let auth = express.Router();
  let authService = new AuthenticationService(mainDb, dbs);

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

  return auth;
} 

