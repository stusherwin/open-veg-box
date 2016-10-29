import { Component, OnInit, Input } from '@angular/core';
import { Round, RoundCustomer } from './round'
import { RoundService } from './round.service'
import { CustomerService } from '../customers/customer.service'
import { RoundEditComponent } from './round-edit.component'
import { RoundDisplayComponent } from './round-display.component'
import { Observable } from 'rxjs/Observable';
import { RouteParams } from '@angular/router-deprecated';
import { HighlightService } from '../shared/highlight.service';
import { HighlightableDirective } from '../shared/highlightable.directive';
import 'rxjs/add/observable/concat';
import 'rxjs/add/operator/last';

@Component({
  selector: 'cc-rounds',
  styleUrls: ['app/rounds/rounds.component.css'],
  templateUrl: 'app/rounds/rounds.component.html',
  directives: [RoundDisplayComponent, RoundEditComponent, HighlightableDirective],
  providers: [RoundService, CustomerService, HighlightService]
})
export class RoundsComponent implements OnInit {
  constructor(roundService: RoundService, customerService: CustomerService, routeParams: RouteParams) {
    this.roundService = roundService;
    this.customerService = customerService;
    this.queryParams = routeParams.params;
  }

  roundService: RoundService;
  customerService: CustomerService;
  rounds: Round[] = [];
  customers: RoundCustomer[] = [];

  queryParams: {[key: string]: string};

  ngOnInit() {
    this.roundService.getAll(this.queryParams).subscribe(rounds => {
      this.rounds = rounds;
    } );

    this.customerService.getAll(this.queryParams).subscribe(customers => {
      this.customers = customers.map(c => new RoundCustomer(c.id, c.name, c.address));
    } );
  }

  add(round: Round) {
    this.roundService.add(round, this.queryParams).subscribe(rounds => {
      this.rounds = rounds;
    });
  }

  delete(round: Round) {
    this.roundService.delete(round.id, this.queryParams).subscribe(rounds => {
      this.rounds = rounds;
    });
  }
}