import {Objects} from '../shared/objects'
import {EmailService, EmailMessage, EmailRecipient, EmailConfig} from './email.service'

var express = require('express');

var app = express();

export let getEmail = function(config: EmailConfig, authorize: (req: any, res: any, next:() => void) => void): any {
  let emailService = new EmailService(config);
  let email = express.Router();

  email.use(authorize);

  email.post('/send', function(req: any, res: any, next: any) {
    let message = new EmailMessage(req.body.recipients.map((r: any) => new EmailRecipient(r.name, r.address)), req.body.subject, req.body.body);
    emailService.send(message, req.organisation)
                .subscribe(r => res.status(200), next);
  });

  return email;
}