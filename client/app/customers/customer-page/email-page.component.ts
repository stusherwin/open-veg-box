import { Component, OnInit, Input, Inject, forwardRef } from '@angular/core';
import { CustomerService } from '../customer.service'
import { Customer } from '../customer'
import { SendEmailComponent } from '../../email/send-email.component';
import { EmailRecipient } from '../../email/email.service';
import { RouteParams } from '@angular/router-deprecated';
import { CustomerPageService } from './customer-page.component'

@Component({
  selector: 'cc-email-page',
  templateUrl: 'app/customers/customer-page/email-page.component.html',
  directives: [SendEmailComponent]
})
export class EmailPageComponent implements OnInit {
  constructor(private customerService: CustomerService,
    @Inject(forwardRef(() => CustomerPageService))
    private customerPageService: CustomerPageService, private routeParams: RouteParams) {
  }

  customerEmails: EmailRecipient[] = [];

  ngOnInit() {
    this.customerService.get(this.customerPageService.customer.id).subscribe(customer => {
      this.customerEmails = [new EmailRecipient(customer.name, customer.email)];
    });
  }
}