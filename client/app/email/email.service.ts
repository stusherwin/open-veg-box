import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class EmailService {
  http: Http;

  constructor(http: Http) {
    this.http = http;
  }

  send(message: EmailMessage): Observable<boolean> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.post('/api/email/send', JSON.stringify(message), options)
                    .map(res => true);
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