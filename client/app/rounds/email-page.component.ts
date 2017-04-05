import { Component, OnInit, Input, Inject, forwardRef } from '@angular/core';
import { Round } from './round'
import { RoundService } from './round.service'
import { CustomerService } from '../customers/customer.service'
import { SendEmailComponent } from '../email/send-email.component';
import { EmailRecipient } from '../email/email.service';
import { RouteParams } from '@angular/router-deprecated';
import { RoundSectionService } from './round-section.component'

@Component({
  selector: 'cc-email-page',
  templateUrl: 'app/rounds/email-page.component.html',
  directives: [SendEmailComponent]
})
export class EmailPageComponent implements OnInit {
  constructor(private roundService: RoundService,
  @Inject(forwardRef(() => RoundSectionService))
  private roundSectionService: RoundSectionService) {
  }

  customerEmails: EmailRecipient[];

  ngOnInit() {
    this.customerEmails = this.roundSectionService.round.customers.map(c => new EmailRecipient(c.name, c.email));
  }
}