import { Component, Directive, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { FocusDirective } from '../shared/focus.directive'
import { HighlightableDirective } from '../shared/highlightable.directive'
import { RoundCustomer } from './round'

@Component({
  selector: 'cc-round-customers',
  directives: [FocusDirective, HighlightableDirective],
  templateUrl: 'app/rounds/round-customers.component.html'
})
export class RoundCustomersComponent {
  focusedCustomerId: number;

  @Input()
  editTabindex: number;

  @Input()
  value: RoundCustomer[];
  
  @Output()
  valueChange = new EventEmitter<RoundCustomer[]>();

  @Input()
  customers: RoundCustomer[];

  @Output()
  focus = new EventEmitter<any>();

  @Output()
  blur = new EventEmitter<any>();

  @Output()
  add = new EventEmitter<number>();

  @Output()
  remove = new EventEmitter<number>();

  removeCustomerClick(customerId: number) {
    let index = this.value.findIndex( c => c.id == customerId);
    if(index >= 0) {
      let customer = this.value.find( c => c.id == customerId);
      this.value.splice(index, 1);
      this.customers.push(customer);
      this.remove.emit(customerId);
      this.focusedCustomerId = null;
    }
  }

  addCustomerClick(customerId: number ) {
    let customer = this.customers.find( c => c.id == customerId);
    if(customer) {
      let index = this.customers.findIndex( c => c.id == customerId);
      this.adding = false;
      this.value.push(customer);
      this.customers.splice(index, 1);
      this.add.emit(customer.id);
      this.focusedCustomerId = null;
    }
  }

  focusCustomer(customerId: number) {
    this.focusedCustomerId = customerId;
  }

  unfocusCustomer() {
    this.focusedCustomerId = null;
  }
}