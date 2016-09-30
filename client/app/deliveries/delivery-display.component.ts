import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Delivery } from './delivery';
import { SingleLinePipe } from '../shared/pipes';

@Component({
  selector: 'cc-delivery-display',
  templateUrl: 'app/deliveries/delivery-display.component.html',
  pipes: [SingleLinePipe]
})
export class DeliveryDisplayComponent {
  @Input()
  delivery: Delivery;

  @Input()
  editDisabled: boolean;

  @Output()
  onEdit = new EventEmitter<Delivery>();

  @Output()
  onDelete = new EventEmitter<Delivery>();

  edit() {
    this.onEdit.emit(this.delivery);
  } 

  delete() {
    this.onDelete.emit(this.delivery);
  } 

  clickEmail(event:any) {
    if(this.editDisabled) { event.preventDefault(); return false;} return true;
  }
}