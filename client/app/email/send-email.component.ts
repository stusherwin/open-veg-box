import { Component, OnInit, Input } from '@angular/core';
import { ROUTER_DIRECTIVES, Router } from '@angular/router-deprecated';
import { FocusDirective } from '../shared/focus.directive';
import { FocusService } from '../shared/focus.service';
import { EmailService, EmailMessage, EmailRecipient } from '../email/email.service';

@Component({
  selector: 'cc-send-email',
  templateUrl: 'app/email/send-email.component.html',
  providers: [FocusService, EmailService],
  directives: [FocusDirective, ROUTER_DIRECTIVES]
})
export class SendEmailComponent {
  constructor(private emailService: EmailService, private router: Router) {
  }

  @Input()
  recipients: EmailRecipient[]

  subject: string;
  body: string;

  @Input()
  cancelLinkParams: any[]

  @Input()
  successLinkParams: any[]

  send() {
    this.emailService.send(new EmailMessage(this.recipients, this.subject, this.body))
                     .subscribe(() => this.router.navigate(this.successLinkParams));
  }
}