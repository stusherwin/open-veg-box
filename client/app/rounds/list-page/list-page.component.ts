import { Component, OnInit, Input, Renderer } from '@angular/core';
import { Round, RoundCustomer } from '../round'
import { RoundService } from '../round.service'
import { CustomerService } from '../../customers/customer.service'
import { ListPageRoundComponent } from './list-page-round.component'
import { ListPageAddComponent } from './list-page-add.component'
import { Observable } from 'rxjs/Observable';
import { RouteParams } from '@angular/router-deprecated';
import { RouteConfig, Router, ROUTER_DIRECTIVES } from '@angular/router-deprecated';
import 'rxjs/add/observable/concat';
import 'rxjs/add/operator/last';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/combineLatest';
import { SectionHeaderComponent } from '../../structure/section-header.component'
import { Arrays } from '../../shared/Arrays'
import { ButtonComponent } from '../../shared/button.component'

@Component({
  selector: 'cc-list-page',
  templateUrl: 'app/rounds/list-page/list-page.component.html',
  directives: [ListPageRoundComponent, ListPageAddComponent, SectionHeaderComponent, ButtonComponent],
  providers: [RoundService, CustomerService]
})
export class ListPageComponent implements OnInit {
  queryParams: {[key: string]: string};
  rounds: Round[] = [];
  unusedCustomers: RoundCustomer[] = [];
  loaded: boolean;

  constructor(
    private roundService: RoundService,
    private customerService: CustomerService,
    private renderer: Renderer,
    routeParams: RouteParams) {
    this.queryParams = routeParams.params;
  }

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
    this.roundService.add(round).subscribe(id => {
      round.id = id;
      this.rounds.unshift(round);
    });
  }

  onDelete(round: Round) {
    this.roundService.delete(round.id).subscribe(() => {
      Arrays.remove(this.rounds, round);
    });
  }

  onUpdate(round: Round) {
    this.roundService.update(round.id, round).subscribe(() => {});
  }

  onCustomerAdd(event: any) {
    this.roundService.addCustomer(event.roundId, event.customerId)
      .mergeMap(_ => this.customerService.getAllWithNoRound(this.queryParams))
      .subscribe(unusedCustomers => {
        this.unusedCustomers = unusedCustomers.map(c => new RoundCustomer(c.id, c.name, c.address, c.email));
      });
  }

  onCustomerRemove(event: any) {
    this.roundService.removeCustomer(event.roundId, event.customerId)
      .mergeMap(_ => this.customerService.getAllWithNoRound(this.queryParams))
      .subscribe(unusedCustomers => {
        this.unusedCustomers = unusedCustomers.map(c => new RoundCustomer(c.id, c.name, c.address, c.email));
      });
  }
}