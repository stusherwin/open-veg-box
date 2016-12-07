import { Component, OnInit, Input } from '@angular/core';
import { Round } from './round'
import { RoundService } from './round.service'
import { CustomerService } from '../customers/customer.service'
import { RouteParams, Router } from '@angular/router-deprecated';

@Component({
  selector: 'cc-round-email',
  templateUrl: 'app/rounds/round-email.component.html',
  providers: [RoundService, CustomerService]
})
export class RoundEmailComponent implements OnInit {
  constructor(private roundService: RoundService, private routeParams: RouteParams) {
  }

  round: Round;

  ngOnInit() {
    let roundId = +this.routeParams.params['roundId'];
    this.roundService.get(roundId).subscribe(round => this.round = round);
  }
}