import {Objects} from '../shared/objects'
import {authorize} from '../auth/auth.middleware'
import {ConfigService} from '../config/config.service'
import {EmailService, EmailMessage, EmailRecipient, EmailConfig} from './email.service'

var express = require('express');

var app = express();

var configService = new ConfigService();
var emailService = new EmailService(configService.email);

export let email = express.Router();

email.use(authorize);

email.post('/send', function(req: any, res: any, next: any) {
  let message = new EmailMessage(req.body.recipients.map((r: any) => new EmailRecipient(r.name, r.address)), req.body.subject, req.body.body);
  emailService.send(message, req.organisation)
              .subscribe(r => res.status(200), next);
});