import { Component, OnInit, Input, Renderer } from '@angular/core';
import { Round, RoundCustomer } from './round'
import { RoundService } from './round.service'
import { CustomerService } from '../customers/customer.service'
import { RoundsPageRoundComponent } from './rounds-page-round.component'
import { Observable } from 'rxjs/Observable';
import { RouteParams } from '@angular/router-deprecated';
import { RouteConfig, Router, ROUTER_DIRECTIVES } from '@angular/router-deprecated';
import { ActiveService, ActiveElementDirective, ActivateOnFocusDirective, DeactivateOnBlurDirective } from '../shared/active-elements'
import { RoundCustomersService } from './round-customers.service'
import 'rxjs/add/observable/concat';
import 'rxjs/add/operator/last';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/combineLatest';

@Component({
  selector: 'cc-round-page',
  templateUrl: 'app/rounds/round-page.component.html',
  directives: [RoundsPageRoundComponent, ActiveElementDirective, ActivateOnFocusDirective, DeactivateOnBlurDirective, ROUTER_DIRECTIVES],
  styleUrls: ['app/rounds/round-page.component.css'],
  styles: [`
    html>/**/body a i::before, x:-moz-any-link {
      margin-top: -1px;
    }
  `],
  providers: [RoundService, CustomerService, ActiveService, RoundCustomersService]
})
export class RoundPageComponent implements OnInit {
  queryParams: {[key: string]: string};
  round: Round;
  unusedCustomers: RoundCustomer[] = [];

  constructor(
    private roundService: RoundService,
    private customerService: CustomerService,
    private renderer: Renderer,
    private routeParams: RouteParams) {
    this.queryParams = routeParams.params;
  }

  ngOnInit() {
    let roundId = +this.routeParams.params['roundId'];
    
    Observable.combineLatest(
      this.roundService.get(roundId),
      this.customerService.getAllWithNoRound(this.queryParams),
      (r, c) => ({r, c})
    )
    .subscribe(({r, c}) => {
      this.round = r;
      this.unusedCustomers = c.map(c => new RoundCustomer(c.id, c.name, c.address, c.email));
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