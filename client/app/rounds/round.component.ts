import { Component, Input, Output, EventEmitter, ViewChild, forwardRef, Inject } from '@angular/core';
import { Round, RoundCustomer } from './round';
import { HeadingComponent } from '../shared/heading.component';
import { FocusDirective } from '../shared/focus.directive'
import { RoundCustomersComponent } from './round-customers.component';
import { ROUTER_DIRECTIVES } from '@angular/router-deprecated';

@Component({
  selector: 'cc-round',
  templateUrl: 'app/rounds/round.component.html',
  directives: [HeadingComponent, FocusDirective, RoundCustomersComponent, ROUTER_DIRECTIVES]
})
export class RoundComponent {
  adding: boolean;
  rowFocused: boolean;

  constructor() {
    this.round = new Round(0, 'New round', []);
  }

  @ViewChild('roundName')
  roundName: HeadingComponent;

  @ViewChild('addButton')
  addButton: FocusDirective;

  @Input()
  addMode: boolean;

  @Input()
  round: Round;

  @Input()
  index: number;

  @Input()
  showAddMessage: boolean;

  @Input()
  customers: RoundCustomer[];

  @Output()
  delete = new EventEmitter<Round>();

  @Output()
  add = new EventEmitter<Round>();

  @Output()
  update = new EventEmitter<Round>();

  @Output()
  customerAdd = new EventEmitter<any>();

  @Output()
  customerRemove = new EventEmitter<any>();

  startAdd() {
    this.adding = true;
    this.roundName.startEdit();
  }

  completeAdd() {
    this.add.emit(this.round);
    this.adding = false;
    this.round = new Round(0, 'New round', []);

    this.startAdd();
  }

  onDelete() {
    this.delete.emit(this.round);
  }

  cancelAdd() {
    this.adding = false;
    this.round = new Round(0, 'New round', []);

    this.addButton.beFocused();
  } 

  clickEmail(event:any) {
    return true;
  }

  onUpdate() {
    if(!this.addMode) {
      this.update.emit(this.round);
    }
  }

  onCustomerAdd(customerId: number) {
    this.customerAdd.emit({roundId: this.round.id, customerId: customerId});
  }

  onCustomerRemove(customerId: number) {
    this.customerRemove.emit({roundId: this.round.id, customerId: customerId});
  }

  onRowFocus() {
    var focusedChanged = !this.rowFocused;
    this.rowFocused = true;
    if(this.addMode && focusedChanged) {
      this.startAdd();
    }
  }

  onRowBlur() {
    if(this.adding) {
      this.adding = false;
      this.round = new Round(0, 'New round', []);
    }
    this.rowFocused = false;
  }
}