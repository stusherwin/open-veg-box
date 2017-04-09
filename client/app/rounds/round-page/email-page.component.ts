import { Component, OnInit, Input, Inject, forwardRef } from '@angular/core';
import { Round } from '../round'
import { RoundService } from '../round.service'
import { CustomerService } from '../../customers/customer.service'
import { SendEmailComponent } from '../../email/send-email.component';
import { EmailRecipient } from '../../email/email.service';
import { RouteParams } from '@angular/router-deprecated';
import { RoundPageService } from './round-page.component'

@Component({
  selector: 'cc-email-page',
  templateUrl: 'app/rounds/round-page/email-page.component.html',
  directives: [SendEmailComponent]
})
export class EmailPageComponent implements OnInit {
  constructor(private roundService: RoundService,
  @Inject(forwardRef(() => RoundPageService))
  private roundPageService: RoundPageService, private routeParams: RouteParams) {
  }

  customerEmails: EmailRecipient[];
  cancelLinkParams: any[];

  ngOnInit() {
    this.customerEmails = this.roundPageService.round.customers.map(c => new EmailRecipient(c.name, c.email));
    this.cancelLinkParams = this.routeParams.params['fromRound']
      ? ['../Details']
      : ['../../Rounds']
  }
}