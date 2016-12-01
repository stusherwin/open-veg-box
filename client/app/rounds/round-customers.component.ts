import { Component, Directive, Input, ViewChild, ElementRef, Output, EventEmitter, ViewChildren, QueryList } from '@angular/core';
import { FocusDirective } from '../shared/focus.directive'
import { RoundCustomer } from './round'
import { Subscription } from 'rxjs/Subscription' 
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'cc-round-customers',
  directives: [FocusDirective],
  templateUrl: 'app/rounds/round-customers.component.html'
})
export class RoundCustomersComponent {
  editing: boolean;
  pendingActions: { customerId: number; actionType: ActionType }[] = [];

  @Input()
  editTabindex: number;

  @Input()
  value: RoundCustomer[];
  
  @Output()
  valueChange = new EventEmitter<RoundCustomer[]>();

  @Input()
  customers: RoundCustomer[];

  @Output()
  add = new EventEmitter<number>();

  @Output()
  remove = new EventEmitter<number>();

  @ViewChild('parent')
  parent: FocusDirective;

  @ViewChildren('button')
  buttons: QueryList<FocusDirective>

  buttonsSubscription: Subscription;
  firstTime: boolean;

  startEdit(autoFocusFirstButton: boolean) {
    if(this.editing) {
      return;
    }

    if(!this.parent.focused) {
      this.parent.beFocused();
    }

    this.editing = true;
    let firstTime = true;
    this.buttonsSubscription = this.buttons.changes.subscribe((buttons: QueryList<FocusDirective>) => {
      if(firstTime) {
        if(buttons.length && autoFocusFirstButton) {
          buttons.first.beFocused();
        }
        firstTime = false;
      } else {
        if(buttons.length) {
          buttons.first.beFocused();
        }
      }
    });
  }

  endEdit() {
    this.buttonsSubscription.unsubscribe();
    this.editing = false;
  }

  removeCustomerClick(customerId: number) {
    let index = this.value.findIndex( c => c.id == customerId);
    if(index >= 0) {
      let customer = this.value.find( c => c.id == customerId);
      this.value.splice(index, 1);
      this.customers.push(customer);
      this.remove.emit(customerId);
    }
  }

  addCustomerClick(customerId: number ) {
    let customer = this.customers.find( c => c.id == customerId);
    if(customer) {
      let index = this.customers.findIndex( c => c.id == customerId);
      this.value.push(customer);
      this.customers.splice(index, 1);
      this.add.emit(customer.id);
    }
  }
}

enum ActionType {
  Add,
  Remove
}