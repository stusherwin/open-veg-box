import { Component, OnInit, Input } from '@angular/core';
import { Round } from './round'
import { RoundService } from './round.service'
import { CustomerService } from '../customers/customer.service'
import { EmailCustomersComponent, CustomerEmail } from '../customers/email-customers.component';
import { RouteParams } from '@angular/router-deprecated';

@Component({
  selector: 'cc-email-round',
  templateUrl: 'app/rounds/email-round.component.html',
  providers: [RoundService, CustomerService],
  directives: [EmailCustomersComponent]
})
export class EmailRoundComponent implements OnInit {
  constructor(private roundService: RoundService, private routeParams: RouteParams) {
  }

  round: Round;
  customerEmails: CustomerEmail[];

  ngOnInit() {
    let roundId = +this.routeParams.params['roundId'];
    this.roundService.get(roundId).subscribe(round => {
      this.round = round;
      this.customerEmails = round.customers.map(c => new CustomerEmail(c.id, c.name, c.email));
    });
  }
}