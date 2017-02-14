import { Component, OnInit, Input } from '@angular/core';
import { Customer } from './customer'
import { CustomerService } from './customer.service'
import { CustomerComponent } from './customer.component'
import { Observable } from 'rxjs/Observable';
import { RouteParams } from '@angular/router-deprecated';
import { FocusService } from '../shared/focus.service';
import { ActiveService, ActiveElementDirective } from '../shared/active-elements'
import 'rxjs/add/observable/concat';
import 'rxjs/add/operator/last';

@Component({
  selector: 'cc-customers-home',
  templateUrl: 'app/customers/customers-home.component.html',
  directives: [CustomerComponent, ActiveElementDirective],
  providers: [CustomerService, FocusService, ActiveService]
})
export class CustomersHomeComponent implements OnInit {
  constructor(customerService: CustomerService, routeParams: RouteParams) {
    this.customerService = customerService;
    this.queryParams = routeParams.params;
  }

  customerService: CustomerService;
  customers: Customer[] = [];
  loaded: boolean;

  queryParams: {[key: string]: string};

  ngOnInit() {
    this.customerService.getAll(this.queryParams).subscribe(customers => {
      this.loaded = true;
      this.customers = customers;
    } );
  }

  onAdd(customer: Customer) {
    this.customerService.add(customer, this.queryParams).subscribe(customers => {
      this.customers = customers;
    });
  }

  onDelete(customer: Customer) {
    this.customerService.delete(customer.id, this.queryParams).subscribe(customers => {
      this.customers = customers;
    });
  }

  onUpdate(customer: Customer) {
    this.customerService.update(customer.id, customer, this.queryParams).subscribe(customers => {});
  }
}