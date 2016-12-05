import { Component, Directive, Input, ViewChild, ElementRef, Output, EventEmitter, ViewChildren, QueryList } from '@angular/core';
import { FocusDirective } from '../shared/focus.directive'
import { RoundCustomer } from './round'
import { Subscription } from 'rxjs/Subscription' 
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'cc-round-customers',
  directives: [FocusDirective],
  templateUrl: 'app/rounds/round-customers.component.html',
  host: {
    '(document:click)': 'onClickOutside($event)',
  }
})
export class RoundCustomersComponent {
  editing: boolean;
  buttonsSubscription: Subscription;
  lastTouchedCustomerId: number;

  constructor(private el: ElementRef) {
  }

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
          let valueIndex = this.value.findIndex( c => c.id == this.lastTouchedCustomerId);
          let customersIndex = this.customers.findIndex( c => c.id == this.lastTouchedCustomerId);
          let index = valueIndex >= 0 ? valueIndex : (this.value.length + customersIndex);
          buttons.toArray()[index].beFocused();
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
      this.customers.sort((a,b) => a.name < b.name? -1 : 1);
      this.remove.emit(customerId);
      this.lastTouchedCustomerId = customerId;
    }
  }

  addCustomerClick(customerId: number ) {
    let customer = this.customers.find( c => c.id == customerId);
    if(customer) {
      let index = this.customers.findIndex( c => c.id == customerId);
      this.value.push(customer);
      this.customers.splice(index, 1);
      this.add.emit(customer.id);
      this.lastTouchedCustomerId = customer.id;      
    }
  }

  onClickOutside(event: MouseEvent) {
    if(this.editing && event.clientX > 0 && event.clientY > 0) {
      let clientRect = this.el.nativeElement.getBoundingClientRect();
      let isInside = event.clientX >= clientRect.left && event.clientX <= clientRect.right
                  && event.clientY >= clientRect.top && event.clientY <= clientRect.bottom;
      if (!isInside) {
        this.endEdit();
      }
    }
  }
}