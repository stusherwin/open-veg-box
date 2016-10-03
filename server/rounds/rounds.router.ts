import {Round} from './round'
import {RoundsService} from './rounds.service'
import {wl} from '../shared/helpers'
import {authorize} from '../auth/auth.middleware'

var express = require('express');

var app = express();

var roundsService = new RoundsService();

export let rounds = express.Router();

rounds.use(authorize);

rounds.get('/', function(req: any, res: any) {
  roundsService.getAll(wl(['page', 'pageSize'], req.query), req.db)
                  .subscribe(rounds => res.json(rounds));
});

rounds.post('/:id', function(req: any, res: any) {
  roundsService.update(req.params.id, req.body, wl(['page', 'pageSize'], req.query), req.db)
                  .subscribe(rounds => res.json(rounds));
});

rounds.put('/', function(req: any, res: any) {
  roundsService.add(req.body, wl(['page', 'pageSize'], req.query), req.db)
                  .subscribe(rounds => res.json(rounds));
});

rounds.delete('/:id', function(req: any, res: any) {
  roundsService.delete(req.params.id, wl(['page', 'pageSize'], req.query), req.db)
                  .subscribe(rounds => res.json(rounds));
});