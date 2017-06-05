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
    private page: CustomerPageService, private routeParams: RouteParams) {
  }

  customerEmails: EmailRecipient[];
  backLinkParams: any[];

  ngOnInit() {
    this.customerEmails = [new EmailRecipient(this.page.customer.name, this.page.customer.email)];
    this.backLinkParams = ['../ContactDetails']
  }
}