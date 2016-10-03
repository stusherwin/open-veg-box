import { Component, OnInit, Input } from '@angular/core';
import { Round } from './round'
import { RoundService } from './round.service'
import { RoundEditComponent } from './round-edit.component'
import { RoundDisplayComponent } from './round-display.component'
import { Observable } from 'rxjs/Observable';
import { RouteParams } from '@angular/router-deprecated';

@Component({
  selector: 'cc-rounds',
  styleUrls: ['app/rounds/rounds.component.css'],
  templateUrl: 'app/rounds/rounds.component.html',
  directives: [RoundDisplayComponent, RoundEditComponent],
  providers: [RoundService]
})
export class RoundsComponent implements OnInit {
  private adding: Round;
  private editing: Round;

  constructor(roundService: RoundService, routeParams: RouteParams) {
    this.roundService = roundService;
    this.queryParams = routeParams.params;
  }

  roundService: RoundService;
  rounds: Round[] = [];

  queryParams: {[key: string]: string};

  ngOnInit() {
    this.roundService.getAll(this.queryParams).subscribe(d => {
      this.rounds = d;
    } );
  }

  startAdd() {
    this.adding = new Round(0, 'New round');
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
    this.roundService.update(this.editing.id, this.editing, this.queryParams).subscribe(d => {
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