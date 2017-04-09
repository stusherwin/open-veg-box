import { Component, OnInit, Input } from '@angular/core';
import { CustomerService } from '../customer.service'
import { Customer } from '../customer'
import { SendEmailComponent } from '../../email/send-email.component';
import { EmailRecipient } from '../../email/email.service';
import { RouteParams } from '@angular/router-deprecated';

@Component({
  selector: 'cc-email-page',
  templateUrl: 'app/customers/customer-page/email-page.component.html',
  providers: [CustomerService],
  directives: [SendEmailComponent]
})
export class EmailPageComponent implements OnInit {
  constructor(private customerService: CustomerService, private routeParams: RouteParams) {
  }

  customer: Customer;
  customerEmails: EmailRecipient[];

  ngOnInit() {
    let customerId = +this.routeParams.params['customerId'];
    this.customerService.get(customerId).subscribe(customer => {
      this.customer = customer;
      this.customerEmails = [new EmailRecipient(customer.name, customer.email)];
    });
  }
}