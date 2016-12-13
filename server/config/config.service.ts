import {EmailConfig} from '../email/email.service';

export class ConfigService {
  email: EmailConfig = {
    fromName: '',
    fromAddress: '',
    smtpConnection: ''
  };

  constructor() {
    try {
      this.email = require('../config.json');
    } catch(ex) {
      try {
        this.email = {  
          fromName: process.env.EMAIL_FROM_NAME,
          fromAddress: process.env.EMAIL_FROM_ADDRESS,
          smtpConnection: process.env.EMAIL_SMTP_CONNECTION
        }
      } catch(ex) {
      }
    }
  }
}