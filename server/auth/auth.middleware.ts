import {AuthenticationService} from './authentication.service'

export let authorize = function (req: any, res: any, next:() => void) {
  var authService = new AuthenticationService();
  var credentials = getCredentials(req);

  if (credentials == null) {
    res.set('WWW-Authenticate', 'X-Basic realm="Restricted Area"');
    res.sendStatus(401);
  }

  authService.login(credentials.username, credentials.password)
    .subscribe(user => {
      req.db = authService.getDb(user.username);
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