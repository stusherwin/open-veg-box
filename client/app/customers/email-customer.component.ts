import { Component, OnInit, Input } from '@angular/core';
import { CustomerService } from './customer.service'
import { Customer } from './customer'
import { EmailCustomersComponent, CustomerEmail } from './email-customers.component';
import { RouteParams } from '@angular/router-deprecated';

@Component({
  selector: 'cc-email-customer',
  templateUrl: 'app/customers/email-customer.component.html',
  providers: [CustomerService],
  directives: [EmailCustomersComponent]
})
export class EmailCustomerComponent implements OnInit {
  constructor(private customerService: CustomerService, private routeParams: RouteParams) {
  }

  customer: Customer;
  customerEmails: CustomerEmail[];

  ngOnInit() {
    let customerId = +this.routeParams.params['customerId'];
    this.customerService.get(customerId).subscribe(customer => {
      this.customer = customer;
      this.customerEmails = [new CustomerEmail(customer.id, customer.name, customer.email)];
    });
  }
}