import { Component, Input, Output, EventEmitter, ViewChild, forwardRef, Inject, ElementRef, Renderer } from '@angular/core';
import { Round, RoundCustomer } from './round';
import { HeadingComponent } from '../shared/heading.component';
import { RoundCustomersComponent } from './round-customers.component';
import { ROUTER_DIRECTIVES } from '@angular/router-deprecated';
import { ActiveElementDirective, ActivateOnFocusDirective, DeactivateOnBlurDirective } from '../shared/active-elements'

@Component({
  selector: 'cc-round',
  templateUrl: 'app/rounds/round.component.html',
  directives: [HeadingComponent, ActiveElementDirective, ActivateOnFocusDirective, DeactivateOnBlurDirective, RoundCustomersComponent, ROUTER_DIRECTIVES]
})
export class RoundComponent {
  rowFocused: boolean;

  constructor(private renderer: Renderer) {
  }

  @ViewChild('roundName')
  roundName: HeadingComponent;

  @ViewChild('active')
  active: ActiveElementDirective;

  @Input()
  round: Round;

  @Input()
  index: number;

  @Input()
  unusedCustomers: RoundCustomer[];

  @Output()
  delete = new EventEmitter<Round>();

  @Output()
  update = new EventEmitter<Round>();

  @Output()
  customerAdd = new EventEmitter<any>();

  @Output()
  customerRemove = new EventEmitter<any>();

  onDelete() {
    this.delete.emit(this.round);
    this.active.makeInactive();
  }

  clickEmail(event:any) {
    return true;
  }

  onUpdate() {
    this.update.emit(this.round);
  }

  onCustomerAdd(customerId: number) {
    this.customerAdd.emit({roundId: this.round.id, customerId: customerId});
  }

  onCustomerRemove(customerId: number) {
    this.customerRemove.emit({roundId: this.round.id, customerId: customerId});
  }
}