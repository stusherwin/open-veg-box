import {AuthenticationService} from './authentication.service'

export let authorize = function (req: any, res: any, next:() => void) {
  var authService = new AuthenticationService();
  var authorization = req.get('Authorization');
  if (!authorization) {
    res.set('WWW-Authenticate', 'X-Basic realm="Restricted Area"');
    res.sendStatus(401);
  }

  var token = authorization.substring(8);
  var decoded = new Buffer(token, 'base64').toString('ascii').split(':');
  
  authService.login(decoded[0], decoded[1])
    .subscribe(user => {
      console.log(user.username);
      req.db = authService.getDb(user.username);
      next();
    }, e => {
      res.set('WWW-Authenticate', 'X-Basic realm="Restricted Area"');
      res.sendStatus(401);
    });
};