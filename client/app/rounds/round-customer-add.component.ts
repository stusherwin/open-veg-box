import { Component, Directive, Input, ViewChild, ElementRef, Output, EventEmitter, ViewChildren, QueryList, AfterViewInit, ChangeDetectorRef, AfterViewChecked, OnChanges, Inject, forwardRef, OnInit, OnDestroy, Renderer } from '@angular/core';
import { RoundCustomer } from './round'
import { Customer } from '../customers/customer'
import { Subscription } from 'rxjs/Subscription'
import { Observable } from 'rxjs/Observable';
import { ActiveDirective, ActiveParentDirective, ActiveService, ActivateOnFocusDirective } from '../shared/active-elements';

@Component({
  selector: 'cc-round-customer-add',
  templateUrl: 'app/rounds/round-customer-add.component.html',
  directives: [ActiveDirective, ActivateOnFocusDirective, ActiveParentDirective]
})
export class RoundCustomerAddComponent {
  adding: boolean;
  addHover: boolean;
  customer: Customer;
  
  @Input()
  customers: Customer[];

  @Input()
  editTabindex: number;

  @Input()
  customerNameWidth: number;

  @Input()
  customerAddressWidth: number;

  @Input()
  text: string;

  @ViewChildren('select')
  select: QueryList<ElementRef>

  @ViewChild('add')
  addBtn: ElementRef  

  @Output()
  add = new EventEmitter<RoundCustomer>();

  constructor(private renderer: Renderer) {
  }

  onClick() {
    this.customer = this.customers[0];
    this.adding = true;

    let subscription = this.select.changes.subscribe((f: QueryList<ElementRef>) => {
      if(f.length && this.adding) {
        this.renderer.invokeElementMethod(f.first.nativeElement, 'focus', []);
        subscription.unsubscribe();
      }
    })
  }

  onCustomerChange(event: any) {
    this.customer = this.customers[+event.target.value];
  }

  onOkClick() {
    if(this.tabbedAway && this.customers.length > 1) {
      this.focus();
    }
    this.add.emit(new RoundCustomer(this.customer.id, this.customer.name, this.customer.address, this.customer.email));
    
    this.adding = false;
    this.tabbedAway = false;
  }

  onCancelClick() {
    this.adding = false;
    this.tabbedAway = false;
  }
  
  onDeactivate() {
    this.addHover = false;
    if(this.adding) {
      if(this.tabbedAway) {
        this.onOkClick();
      } else {
        this.onCancelClick();
      }
    }
  }

  focus() {
    setTimeout(() => this.renderer.invokeElementMethod(this.addBtn.nativeElement, 'focus', []))
  }

  tabbedAway = false;
  keydown(event: KeyboardEvent) {
    if(!this.adding) {
      if(event.key == 'Enter') {
        this.onClick();
      }
    } else {
      if(event.key == 'Enter') {
        this.onOkClick();
      } else if(event.key == 'Escape') {
        this.onCancelClick();
      } else if(event.key == 'Tab' && !event.shiftKey) {
        this.tabbedAway = true;
      }
    }
  }
}