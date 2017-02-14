import { Component, Directive, Input, ViewChild, ElementRef, Output, EventEmitter, ViewChildren, QueryList, AfterViewInit, ChangeDetectorRef, AfterViewChecked, OnChanges, Inject, forwardRef, OnInit, OnDestroy } from '@angular/core';
import { RoundCustomer } from './round'
import { Customer } from '../customers/customer'
import { Subscription } from 'rxjs/Subscription'
import { Observable } from 'rxjs/Observable';
import { EditableComponent } from '../shared/editable.component'
import { Arrays } from '../shared/arrays'
import { RoundCustomerAddComponent } from './round-customer-add.component' 
import { RoundCustomerRemoveComponent } from './round-customer-remove.component' 
import { ActiveElementDirective } from '../shared/active-elements';
import { RoundCustomersService } from './round-customers.service'

const CUSTOMER_NAME_PADDING = 20;
const CUSTOMER_ADDRESS_PADDING = 20;

@Component({
  selector: 'cc-round-customers',
  directives: [EditableComponent, RoundCustomerAddComponent, RoundCustomerRemoveComponent, ActiveElementDirective],
  templateUrl: 'app/rounds/round-customers.component.html'
})
export class RoundCustomersComponent implements AfterViewChecked {
  customerNamePadding = CUSTOMER_NAME_PADDING;
  customerAddressPadding = CUSTOMER_ADDRESS_PADDING;
  customerNameWidth: number;
  customerAddressWidth: number;
  customerNameMaxWidth: number;
  customerAddressMaxWidth: number;

  @Input()
  value: RoundCustomer[];

  @Input()
  customers: Customer[] = [];

  @Input()
  unusedCustomers: Customer[] = [];

  @Input()
  editTabindex: number;

  @ViewChild('add')
  addComponent: RoundCustomerAddComponent

  @ViewChildren('remove')
  removeComponents: QueryList<RoundCustomerRemoveComponent>

  @ViewChildren('customerNameTest')
  customerNameTests: QueryList<ElementRef>

  @ViewChildren('customerAddressTest')
  customerAddressTests: QueryList<ElementRef> 

  @Output()
  add = new EventEmitter<number>();

  @Output()
  remove = new EventEmitter<number>();

  constructor(
    @Inject(forwardRef(() => RoundCustomersService))
    private service: RoundCustomersService,

    private changeDetector: ChangeDetectorRef) {
  }

  ngAfterViewChecked() {
    // TODO: move this out of AfterViewChecked?
    // Here because AfterViewChecked is the earliest event where correct element widths are available
    this.recalculateWidths();
  }

  onCustomerAdd(customer: RoundCustomer) {
    this.value.push(customer);
    this.add.emit(customer.id);
  }

  onRemove(customer: RoundCustomer, keyboard: boolean) {
    this.remove.emit(customer.id);
    let index = this.value.findIndex(c => c.id == customer.id);
    Arrays.remove(this.value, customer);
    
    if(keyboard) {
      if(this.value.length) {
        let nextRemoveFocusIndex = Math.min(index, this.value.length - 1);
        setTimeout(() => this.removeComponents.toArray()[nextRemoveFocusIndex].focus());     
      } else {
        setTimeout(() => this.addComponent.focus());
      }
    }
  }

  recalculateWidths() {
    let newNameMaxWidth = Math.floor(Math.max(...this.customerNameTests.map(e => e.nativeElement.getBoundingClientRect().width)));
    let newAddressMaxWidth = Math.floor(Math.max(...this.customerAddressTests.map(e => e.nativeElement.getBoundingClientRect().width)));

    if(newNameMaxWidth != this.customerNameMaxWidth || newAddressMaxWidth != this.customerAddressMaxWidth) {
      this.customerNameMaxWidth = newNameMaxWidth;
      this.customerAddressMaxWidth = newAddressMaxWidth;

      this.service.newMaxWidths(this, newNameMaxWidth, newAddressMaxWidth);
    }
  }

  newMaxWidths(maxNameWidth: number, maxAddressWidth: number) {
    this.customerNameWidth = maxNameWidth;
    this.customerAddressWidth = maxAddressWidth;

    this.changeDetector.detectChanges();
  }
}