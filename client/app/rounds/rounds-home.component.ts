import { Component, OnInit, Input } from '@angular/core';
import { Round, RoundCustomer } from './round'
import { RoundService } from './round.service'
import { CustomerService } from '../customers/customer.service'
import { RoundComponent } from './round.component'
import { RoundAddComponent } from './round-add.component'
import { Observable } from 'rxjs/Observable';
import { RouteParams } from '@angular/router-deprecated';
import { RouteConfig, Router, ROUTER_DIRECTIVES } from '@angular/router-deprecated';
import { ActiveService, ActiveElementDirective } from '../shared/active-elements'
import { RoundCustomersService } from './round-customers.service'
import 'rxjs/add/observable/concat';
import 'rxjs/add/operator/last';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/combineLatest';

@Component({
  selector: 'cc-rounds-home',
  templateUrl: 'app/rounds/rounds-home.component.html',
  directives: [RoundComponent, ActiveElementDirective, RoundAddComponent],
  providers: [RoundService, CustomerService, ActiveService, RoundCustomersService]
})
export class RoundsHomeComponent implements OnInit {
  constructor(roundService: RoundService, customerService: CustomerService, routeParams: RouteParams) {
    this.roundService = roundService;
    this.customerService = customerService;
    this.queryParams = routeParams.params;
  }

  roundService: RoundService;
  customerService: CustomerService;
  rounds: Round[] = [];
  unusedCustomers: RoundCustomer[] = [];
  loaded: boolean;

  queryParams: {[key: string]: string};

  ngOnInit() {
    this.roundService.getAll(this.queryParams)
      .combineLatest(
        this.customerService.getAllWithNoRound(this.queryParams),
        (rounds, unusedCustomers) => ({rounds, unusedCustomers}))
      .subscribe(({rounds, unusedCustomers}) => {
        this.loaded = true;
        this.rounds = rounds;
        this.unusedCustomers = unusedCustomers.map(c => new RoundCustomer(c.id, c.name, c.address, c.email));
      });
  }

  onAdd(round: Round) {
    this.roundService.add(round, this.queryParams).subscribe(rounds => {
      this.rounds = rounds;
    });
  }

  onDelete(round: Round) {
    this.roundService.delete(round.id, this.queryParams).subscribe(rounds => {
      this.rounds = rounds;
    });
  }

  onUpdate(round: Round) {
    this.roundService.update(round.id, round, this.queryParams).subscribe(rounds => {});
  }

  onCustomerAdd(event: any) {
    this.roundService.addCustomer(event.roundId, event.customerId, this.queryParams)
      .mergeMap(_ => this.customerService.getAllWithNoRound(this.queryParams))
      .subscribe(unusedCustomers => {
        this.unusedCustomers = unusedCustomers.map(c => new RoundCustomer(c.id, c.name, c.address, c.email));
      });
  }

  onCustomerRemove(event: any) {
    this.roundService.removeCustomer(event.roundId, event.customerId, this.queryParams)
      .mergeMap(_ => this.customerService.getAllWithNoRound(this.queryParams))
      .subscribe(unusedCustomers => {
        this.unusedCustomers = unusedCustomers.map(c => new RoundCustomer(c.id, c.name, c.address, c.email));
      });
  }
}