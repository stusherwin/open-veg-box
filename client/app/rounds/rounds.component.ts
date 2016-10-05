import { Component, OnInit, Input } from '@angular/core';
import { Round, RoundCustomer } from './round'
import { RoundService } from './round.service'
import { CustomerService } from '../customers/customer.service'
import { RoundEditComponent } from './round-edit.component'
import { RoundDisplayComponent } from './round-display.component'
import { Observable } from 'rxjs/Observable';
import { RouteParams } from '@angular/router-deprecated';
import 'rxjs/add/observable/concat';
import 'rxjs/add/operator/last';

@Component({
  selector: 'cc-rounds',
  styleUrls: ['app/rounds/rounds.component.css'],
  templateUrl: 'app/rounds/rounds.component.html',
  directives: [RoundDisplayComponent, RoundEditComponent],
  providers: [RoundService, CustomerService]
})
export class RoundsComponent implements OnInit {
  private adding: Round;
  private editing: Round;

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

  startAdd() {
    this.adding = new Round(0, 'New round', []);
  }

  startEdit(round: Round) {
    this.editing = round.clone();
  }

  completeAdd() {
    this.roundService.add(this.adding, this.queryParams).subscribe(d => {
      this.adding = null;
      this.rounds = d;
    });
  }

  completeEdit() {
    let all = [this.roundService.update(this.editing.id, this.editing, this.queryParams)];

    let old = this.rounds.find(r => r.id === this.editing.id);
 
    for(let o of old.customers.filter(o => !this.editing.customers.find(e => e.id === o.id))){
      all.push(this.roundService.removeCustomer(this.editing.id, o.id, this.queryParams));
    }
 
    for(let e of this.editing.customers.filter(e => !old.customers.find(o => e.id === o.id))){
      all.push(this.roundService.addCustomer(this.editing.id, e.id, this.queryParams));
    }

    Observable.concat(...all)
              .last()
              .subscribe(d => {
                this.editing = null;
                this.rounds = d;
              });
  }

  delete(round: Round) {
    this.roundService.delete(round.id, this.queryParams).subscribe(d => {
      this.editing = null;
      this.rounds = d;
    });
  }

  cancel() { 
    this.editing = null;
    this.adding = null;
  }
}