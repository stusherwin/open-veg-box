import { Component, OnInit, Input } from '@angular/core';
import { Customer } from './customer'
import { CustomerService } from './customer.service'
import { CustomerEditComponent } from './customer-edit.component'
import { CustomerDisplayComponent } from './customer-display.component'
import { Observable } from 'rxjs/Observable';
import { RouteParams } from '@angular/router-deprecated';
import { HighlightService } from '../shared/highlight.service';
import { HighlightableDirective } from '../shared/highlightable.directive';
import 'rxjs/add/observable/concat';
import 'rxjs/add/operator/last';

@Component({
  selector: 'cc-customers',
  styleUrls: ['app/customers/customers.component.css'],
  templateUrl: 'app/customers/customers.component.html',
  directives: [CustomerDisplayComponent, HighlightableDirective],
  providers: [CustomerService, HighlightService]
})
export class CustomersComponent implements OnInit {
  constructor(customerService: CustomerService, routeParams: RouteParams) {
    this.customerService = customerService;
    this.queryParams = routeParams.params;
  }

  customerService: CustomerService;
  customers: Customer[] = [];

  queryParams: {[key: string]: string};

  ngOnInit() {
    this.customerService.getAll(this.queryParams).subscribe(customers => {
      this.customers = customers;
    } );
  }

  add(customer: Customer) {
    this.customerService.add(customer, this.queryParams).subscribe(customers => {
      this.customers = customers;
    });
  }

  delete(customer: Customer) {
    this.customerService.delete(customer.id, this.queryParams).subscribe(customers => {
      this.customers = customers;
    });
  }
}