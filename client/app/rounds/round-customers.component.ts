import { Component, Directive, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { FocusDirective } from '../shared/focus.directive'
import { HighlightableDirective } from '../shared/highlightable.directive'
import { RoundCustomer } from './round'

@Component({
  selector: 'cc-round-customers',
  directives: [FocusDirective, HighlightableDirective],
  template: `
    <div class="round-customers">
      <ul *ngIf="value.length">
        <li *ngFor="let c of value">{{c.name}} <a href="#" cc-focus highlight="true" [tabindex]="editTabindex" (click)="$event.preventDefault();removeCustomerClick(c.id)">remove</a></li>
      </ul>
      <select class="input" cc-focus highlight="true" [tabindex]="editTabindex" (focus)="onChildFocus()" (blur)="addCustomerBlur();onChildBlur()" [(ngModel)]="customerIdToAdd" (ngModelChange)="addCustomerModelChange($event)" (click)="addCustomerClick($event)">
        <option [ngValue]="0">Add a customer</option>
        <option *ngFor="let c of customers" [ngValue]="c.id">{{ c.name }}</option>
      </select>
    </div>
  `
})
export class RoundCustomersComponent {
  shouldBlur: boolean;
  customerIdToAdd: number = 0;
  
  @ViewChild('priceElem')
  priceElem: ElementRef;

  @ViewChild('unitTypeElem')
  unitTypeElem: ElementRef;

  @Input()
  editing: boolean;

  @Input()
  addMode: boolean;

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
  
  startEdit() {
    this.focus.emit({type: "focus", srcElement: this});
    this.editing = true;
  }

  endEdit() {
    this.editing = false;
    this.blur.emit({type: "blur", srcElement: this});
  }

  onChildFocus(event: FocusEvent) {
    this.shouldBlur = false;
  }

  onChildBlur(event:FocusEvent) {
    this.shouldBlur = true;
    setTimeout(() => {
      if(this.shouldBlur) {
        this.endEdit();
        this.shouldBlur = true;
      }
    }, 100);
  }

  isOnRound(customer: RoundCustomer) {
    return this.value.map(c => c.id).indexOf(customer.id) >= 0;
  }

  setOnRound(customer: RoundCustomer, evt: any) {
    if( evt.target.checked ) {
      this.value.push(customer);
      this.add.emit(customer.id);
    } else {
      let index = this.value.findIndex( c => c.id == customer.id);
      if(index >= 0) {
        this.value.splice(index, 1);
        this.remove.emit(customer.id);
      }
    }

    this.valueChange.emit(this.value);
  }
  
  removeCustomerClick(customerId: number) {
    let index = this.value.findIndex( c => c.id == customerId);
    if(index >= 0) {
      this.value.splice(index, 1);
      this.remove.emit(customerId);
    }
  }
  
  addCustomerModelChange(customerId: any) {
    if(this.clicked) {
      let customer = this.customers.find( c => c.id == this.customerIdToAdd);
      if(customer) {
        this.customerIdToAdd = 0;      
        this.value.push(customer);
        this.add.emit(customer.id);
      }
    }
  }

  clicked: boolean;
  addCustomerClick() {
    this.clicked = true;
  }

  addCustomerBlur() {
    if(!this.clicked) {
      let customer = this.customers.find( c => c.id == this.customerIdToAdd);
      if(customer) {
        this.customerIdToAdd = 0;      
        this.value.push(customer);
        this.add.emit(customer.id);
      } 
    }
    this.clicked = false;
  }
}