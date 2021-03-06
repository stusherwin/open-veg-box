import { Component, Input, Output, EventEmitter, ViewChild, forwardRef, Inject, ElementRef, Renderer } from '@angular/core';
import { Round, RoundCustomer } from '../round.service';
import { ROUTER_DIRECTIVES } from '@angular/router-deprecated';
import { EditableHeadingComponent } from '../../shared/editable-heading.component'
import { Validators } from '@angular/common'
import { ButtonComponent } from '../../shared/button.component'

@Component({
  selector: 'cc-list-page-round',
  templateUrl: 'app/rounds/list-page/list-page-round.component.html',
  directives: [ROUTER_DIRECTIVES, EditableHeadingComponent, ButtonComponent]
})
export class ListPageRoundComponent {
  rowFocused: boolean;
  roundNameValidators = [Validators.required];

  constructor(private renderer: Renderer) {
  }

  @Input()
  round: Round;

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

  get canEmail() {
    return !this.round.customers.every(c => !c.email);
  }

  onDelete() {
    this.delete.emit(this.round);
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