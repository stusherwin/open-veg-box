import { Component, Directive, Input, ViewChild, ElementRef, Output, EventEmitter, ViewChildren, QueryList, AfterViewInit, ChangeDetectorRef, AfterViewChecked, OnChanges, Inject, forwardRef, OnInit, OnDestroy } from '@angular/core';
import { FocusDirective } from '../shared/focus.directive'
import { RoundCustomer } from './round'
import { Customer } from '../customers/customer'
import { Subscription } from 'rxjs/Subscription'
import { Observable } from 'rxjs/Observable';
import { EditableComponent } from '../shared/editable.component'
import { Arrays } from '../shared/arrays'
import { RoundCustomerAddComponent } from './round-customer-add.component' 
import { RoundCustomerRemoveComponent } from './round-customer-remove.component' 
import { MutuallyExclusiveEditService } from '../boxes/mutually-exclusive-edit.service'
import { RoundCustomersService } from './round-customers.service'

const CUSTOMER_NAME_PADDING = 20;
const CUSTOMER_ADDRESS_PADDING = 20;

@Component({
  selector: 'cc-round-customers',
  directives: [FocusDirective, EditableComponent, RoundCustomerAddComponent, RoundCustomerRemoveComponent],
  templateUrl: 'app/rounds/round-customers.component.html'
})
export class RoundCustomersComponent implements OnInit, AfterViewChecked {
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
  editId: string;

  @Input()
  editTabindex: number;

  @ViewChild('root')
  root: ElementRef

  @ViewChild('focusable')
  focusable: FocusDirective

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

    @Inject(forwardRef(() => MutuallyExclusiveEditService))
    private mutexService: MutuallyExclusiveEditService,

    private changeDetector: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.mutexService.editStart.subscribe(editId => {
      if(editId && editId.startsWith(this.editId)) {
        this.focusable.beFocused()
      }
    });

    this.mutexService.editEnd.subscribe(editId => {
      if(editId && editId.startsWith(this.editId)) {
        this.focusable.beBlurred()
      }
    });
  }

  ngAfterViewChecked() {
    // TODO: move this out of AfterViewChecked?
    // Here because AfterViewChecked is the earliest event where correct element widths are available
    this.recalculateWidths();
  }

  editing(editId: string) {
    return this.mutexService.isAnyEditingWithPrefix(editId);
  }

  anyEditing() {
    return this.mutexService.isAnyEditingWithPrefix(this.editId);
  }

  onCustomerAdd(customer: RoundCustomer) {
    this.value.push(customer);
    this.add.emit(customer.id);
    
    //if(this.customers.length) {
    //  setTimeout(() => this.addComponent.focus());
    //}
  }

  onRemove(customer: RoundCustomer, keyboard: boolean) {
    this.remove.emit(customer.id);
    let index = this.value.findIndex(c => c.id == customer.id);
    Arrays.remove(this.value, customer);
    
    // if(keyboard && this.value.length) {
    //   let nextRemoveFocusIndex = Math.min(index, this.value.length - 1);
    //   setTimeout(() => this.removeComponents.toArray()[nextRemoveFocusIndex].focus());     
    // }
  }

  onRootBlur() {
    this.mutexService.endEditByPrefix(this.editId)
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