import { Component, OnInit, Input } from '@angular/core';
import { Round } from './round'
import { RoundService } from './round.service'
import { CustomerService } from '../customers/customer.service'
import { SendEmailComponent } from '../email/send-email.component';
import { EmailRecipient } from '../email/email.service';
import { RouteParams } from '@angular/router-deprecated';

@Component({
  selector: 'cc-email-page',
  templateUrl: 'app/rounds/email-page.component.html',
  providers: [RoundService, CustomerService],
  directives: [SendEmailComponent]
})
export class EmailPageComponent implements OnInit {
  constructor(private roundService: RoundService, private routeParams: RouteParams) {
  }

  round: Round;
  customerEmails: EmailRecipient[];

  ngOnInit() {
    let roundId = +this.routeParams.params['roundId'];
    this.roundService.get(roundId).subscribe(round => {
      this.round = round;
      this.customerEmails = round.customers.map(c => new EmailRecipient(c.name, c.email));
    });
  }
}