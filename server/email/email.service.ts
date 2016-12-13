import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import {Organisation} from '../auth/organisation';
import 'rxjs/add/observable/bindNodeCallback';
import 'rxjs/add/observable/throw';
var nodemailer = require('nodemailer');

export class EmailService {
  private transporter: any;

  constructor(private config: EmailConfig) {
    this.transporter = nodemailer.createTransport(this.config.smtpConnection);
  }

  formatRecipient(name: string, address: string): string {
    return '"' + name + '" <' + address + '>'
  }

  send(message: EmailMessage, organisation: Organisation): Observable<boolean> {
    if(!organisation.canSendEmails) {
      return Observable.throw('Organisation \'' + organisation.name + '\' does not have permission to send emails.');
    }

    let mailOptions = {
        from: this.formatRecipient(this.config.fromName, this.config.fromAddress),
        to: message.recipients.map(r => this.formatRecipient(r.name, r.address)).join(', '),
        subject: message.subject,
        text: message.body,
        html: message.body
    };

    // For some reason can't pass sendMail directly as a parameter to bindNodeCallback
    // Seems to be a problem with TypeScript.
    let send = Observable.bindNodeCallback((options: any, callback: any) => {
      return this.transporter.sendMail(options, callback);
    });

    return send(mailOptions).map(r => true);
  }
}

export class EmailMessage {
  recipients: EmailRecipient[];
  subject: string;
  body: string;

  constructor(recipients: EmailRecipient[], subject: string, body: string){
    this.recipients = recipients;
    this.subject = subject;
    this.body = body;
  }
}

export class EmailRecipient {
  constructor(name:string, address: string) {
    this.name = name;
    this.address = address;
  }
    
  name: string;
  address: string;
}

export interface EmailConfig {
  fromName: string;
  fromAddress: string;
  smtpConnection: string;
}