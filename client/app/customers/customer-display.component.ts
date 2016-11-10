import { Component, Input, Output, EventEmitter, ViewChild, forwardRef, Inject } from '@angular/core';
import { Customer } from './customer'
import { HeadingComponent } from '../shared/heading.component'
import { FocusDirective } from '../shared/focus.directive'
import { HighlightableDirective } from '../shared/highlightable.directive'
import { CustomerAddressComponent } from './customer-address.component'
import { CustomerEmailComponent } from './customer-email.component'
import { CustomerTelComponent } from './customer-tel.component'

@Component({
  selector: 'cc-customer-display',
  templateUrl: 'app/customers/customer-display.component.html',
  directives: [HeadingComponent, FocusDirective, HighlightableDirective, CustomerAddressComponent, CustomerEmailComponent, CustomerTelComponent],
})
export class CustomerDisplayComponent {
  adding: boolean;
  focusedChild: any;
  focused: boolean;

  constructor() {
    this.customer = new Customer(0, 'New customer', '', '', '', '');
  }

  @ViewChild('customerName')
  customerName: HeadingComponent;

  @ViewChild('addButton')
  addButton: FocusDirective;

  @ViewChild('row')
  row: HighlightableDirective;

  @Input()
  addMode: boolean;

  @Input()
  customer: Customer;

  @Input()
  editDisabled: boolean;

  @Input()
  index: number;

  @Input()
  showAddMessage: boolean;

  @Output()
  onDelete = new EventEmitter<Customer>();

  @Output()
  onSave = new EventEmitter<Customer>();

  startAdd() {
    this.adding = true;
    this.customerName.startEdit();
  }

  completeAdd() {
    this.onSave.emit(this.customer);
    this.adding = false;
    this.customer = new Customer(0, 'New customer', '', '', '', '');

    this.startAdd();
  }

  delete() {
    this.onDelete.emit(this.customer);
  }

  cancelAdd() {
    this.adding = false;
    this.customer = new Customer(0, 'New customer', '', '', '', '');

    this.addButton.focus();
  } 

  blur(evnt: any) {
    if(this.focusedChild && this.focusedChild == evnt.srcElement){
      this.focusedChild = null;
    }

    setTimeout(() => {
      if(!this.focusedChild) {
        if(this.adding) {
          this.adding = false;
          this.customer = new Customer(0, 'New customer', '', '', '', '');
        }
        this.focused = false;
      }
    }, 100);
  }

  focus(evnt: any) {
    if(!this.focused) {
      if(this.addMode) {
        this.startAdd();
      }
    }
    
    this.focusedChild = evnt.srcElement;
    this.focused = true;
  }
  
  clickEmail(event:any) {
    if(this.editDisabled) { event.preventDefault(); return false;} return true;
  }
}