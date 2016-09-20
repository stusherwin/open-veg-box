import { Component, Input, Output, EventEmitter, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Customer } from './customer';
import { SingleLinePipe } from '../shared/pipes';

@Component({
  selector: 'cc-customer-edit',
  templateUrl: 'app/customers/customer-edit.component.html',
  pipes: [SingleLinePipe]
})
export class CustomerEditComponent implements AfterViewInit {
  @Input()
  customer: Customer;

  @Output()
  onSave = new EventEmitter<Customer>();

  @Output()
  onCancel = new EventEmitter();

  @ViewChild('name')
  name: ElementRef;

  ngAfterViewInit() {
    this.name.nativeElement.focus();
  }

  cancel() {
    this.onCancel.emit({});
  }

  save() {
    this.onSave.emit(this.customer);
  }
}