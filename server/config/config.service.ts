import {EmailConfig} from '../email/email.service';

interface Config {
  email_fromName: string;
  email_fromAddress: string;
  email_smtpConnection: string;
  db_connectionString: string;
}

export class ConfigService {
  email: EmailConfig = {
    fromName: '',
    fromAddress: '',
    smtpConnection: ''
  };

  connectionString: string = '';

  constructor() {
    try {
      let config = require('../config.json');
      this.email = {
        fromName: config.email_fromName,
        fromAddress: config.email_fromAddress,
        smtpConnection: config.email_smtpConnection
      }
      this.connectionString = config.db_connectionString;
    } catch(ex) {
      try {
        this.email = {  
          fromName: process.env['EMAIL_FROM_NAME'],
          fromAddress: process.env['EMAIL_FROM_ADDRESS'],
          smtpConnection: process.env['EMAIL_SMTP_CONNECTION']
        }
        this.connectionString = process.env['DATABASE_URL'];
      } catch(ex) {
      }
    }
  }
}2