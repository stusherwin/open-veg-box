import { Component, OnInit, Input } from '@angular/core';
import { Customer } from './customer'
import { CustomerService } from './customer.service'
import { CustomerEditComponent } from './customer-edit.component'
import { CustomerDisplayComponent } from './customer-display.component'
import { Observable } from 'rxjs/Observable';
import { RouteParams } from '@angular/router-deprecated';

@Component({
  selector: 'cc-customers',
  styleUrls: ['app/customers/customers.component.css'],
  templateUrl: 'app/customers/customers.component.html',
  directives: [CustomerDisplayComponent, CustomerEditComponent],
  providers: [CustomerService]
})
export class CustomersComponent implements OnInit {
  private adding: Customer;
  private editing: Customer;

  constructor(customerService: CustomerService, routeParams: RouteParams) {
    this.customerService = customerService;
    this.queryParams = routeParams.params;
  }

  customerService: CustomerService;
  customers: Customer[] = [];

  queryParams: {[key: string]: string};

  ngOnInit() {
    this.customerService.getAll(this.queryParams).subscribe(c => {
      this.customers = c;
    } );
  }

  startAdd() {
    this.adding = new Customer(0, 'New customer', '', '', '', '');
  }

  startEdit(customer: Customer) {
    this.editing = customer.clone();
  }

  completeAdd() {
    this.customerService.add(this.adding, this.queryParams).subscribe(c => {
      this.adding = null;
      this.customers = c;
    });
  }

  completeEdit() {
    this.customerService.update(this.editing.id, this.editing, this.queryParams).subscribe(c => {
      this.editing = null;
      this.customers = c;
    });
  }

  cancel() {
    this.editing = null;
    this.adding = null;
  }
}