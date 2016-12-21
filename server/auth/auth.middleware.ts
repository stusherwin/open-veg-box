import {AuthenticationService} from './authentication.service'
import {SqliteDb} from '../shared/sqlitedb';

export let authorize = function (req: any, res: any, next:() => void) {
  var authService = new AuthenticationService();
  var credentials = getCredentials(req);

  if (credentials == null) {
    res.set('WWW-Authenticate', 'X-Basic realm="Restricted Area"');
    res.sendStatus(401);
    return;
  }

  authService.authenticate(credentials.username, credentials.password)
    .subscribe(org => {
      req.db = new SqliteDb(authService.getDb(org.id));
      req.organisation = org;
      next();
    }, e => {
      res.set('WWW-Authenticate', 'X-Basic realm="Restricted Area"');
      res.sendStatus(401);
    });
};

let getCredentials = function(req: any): Credentials {
  var authorization = req.get('Authorization');

  if (!authorization) {
    return null;
  }

  var token = authorization.substring('X-Basic '.length);
  
  var decoded = new Buffer(token, 'base64').toString('ascii').split(':');
  if (decoded.length != 2) {
    return null;
  }

  return new Credentials(decoded[0], decoded[1]);
}

class Credentials {
  username: string;
  password: string;

  constructor(username: string, password: string) {
    this.username = username;
    this.password = password;
  }
}