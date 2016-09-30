import { Component, Input, Output, EventEmitter, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Delivery } from './delivery';

@Component({
  selector: 'cc-delivery-edit',
  templateUrl: 'app/deliveries/delivery-edit.component.html',
})
export class DeliveryEditComponent implements AfterViewInit {
  @Input()
  delivery: Delivery;

  @Output()
  onSave = new EventEmitter<Delivery>();

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
    this.onSave.emit(this.delivery);
  }
}