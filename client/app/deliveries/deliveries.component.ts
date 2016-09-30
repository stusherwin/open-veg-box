import { Component, OnInit, Input } from '@angular/core';
import { Delivery } from './delivery'
import { DeliveryService } from './delivery.service'
import { DeliveryEditComponent } from './delivery-edit.component'
import { DeliveryDisplayComponent } from './delivery-display.component'
import { Observable } from 'rxjs/Observable';
import { RouteParams } from '@angular/router-deprecated';

@Component({
  selector: 'cc-deliveries',
  styleUrls: ['app/deliveries/deliveries.component.css'],
  templateUrl: 'app/deliveries/deliveries.component.html',
  directives: [DeliveryDisplayComponent, DeliveryEditComponent],
  providers: [DeliveryService]
})
export class DeliveriesComponent implements OnInit {
  private adding: Delivery;
  private editing: Delivery;

  constructor(deliveryService: DeliveryService, routeParams: RouteParams) {
    this.deliveryService = deliveryService;
    this.queryParams = routeParams.params;
  }

  deliveryService: DeliveryService;
  deliveries: Delivery[] = [];

  queryParams: {[key: string]: string};

  ngOnInit() {
    this.deliveryService.getAll(this.queryParams).subscribe(d => {
      this.deliveries = d;
    } );
  }

  startAdd() {
    this.adding = new Delivery(0, 'New delivery');
  }

  startEdit(delivery: Delivery) {
    this.editing = delivery.clone();
  }

  completeAdd() {
    this.deliveryService.add(this.adding, this.queryParams).subscribe(d => {
      this.adding = null;
      this.deliveries = d;
    });
  }

  completeEdit() {
    this.deliveryService.update(this.editing.id, this.editing, this.queryParams).subscribe(d => {
      this.editing = null;
      this.deliveries = d;
    });
  }

  delete(delivery: Delivery) {
    this.deliveryService.delete(delivery.id, this.queryParams).subscribe(d => {
      this.editing = null;
      this.deliveries = d;
    });
  }

  cancel() {
    this.editing = null;
    this.adding = null;
  }
}