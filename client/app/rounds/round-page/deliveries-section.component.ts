import { Component, OnInit, Input } from '@angular/core';
import { RoundDeliveriesPageComponent } from './deliveries-page.component'
import { DeliveryPageComponent } from './delivery-page.component'
import { RouteParams } from '@angular/router-deprecated';
import { RouteConfig, Router, ROUTER_DIRECTIVES } from '@angular/router-deprecated';

@Component({
  selector: 'cc-test-page',
  template: '<h1>Hi there.</h1>'  
})
export class TestPageComponent {

}

@Component({
  selector: 'cc-deliveries-section',
  templateUrl: 'app/rounds/round-page/deliveries-section.component.html',
  directives: [ROUTER_DIRECTIVES],
})

@RouteConfig([
  {
    path: '',
    name: 'Deliveries',
    component: RoundDeliveriesPageComponent
  },
  {
    path: ':deliveryId/...',
    name: 'Delivery',
    component: DeliveryPageComponent
  }
])
export class DeliveriesSectionComponent {
}