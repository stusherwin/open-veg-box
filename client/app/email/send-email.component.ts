import { Component, Input, AfterViewInit, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { ROUTER_DIRECTIVES, Router } from '@angular/router-deprecated';
import { FocusDirective } from '../shared/focus.directive';
import { FocusService } from '../shared/focus.service';
import { EmailService, EmailMessage, EmailRecipient } from '../email/email.service';
import { ValidatableComponent } from '../shared/validatable.component';

@Component({
  selector: 'cc-send-email',
  templateUrl: 'app/email/send-email.component.html',
  providers: [FocusService, EmailService],
directives: [FocusDirective, ROUTER_DIRECTIVES, ValidatableComponent]
})
export class SendEmailComponent implements AfterViewInit {
  constructor(private emailService: EmailService, private router: Router) {
  }

  @Input()
  recipients: EmailRecipient[]

  subject: string = '';
  body: string = '';

  @Input()
  cancelLinkParams: any[]

  @Input()
  successLinkParams: any[]

  @ViewChild('focusable')
  focusable: FocusDirective

  @ViewChildren(ValidatableComponent)
  validatables: QueryList<ValidatableComponent>

  ngAfterViewInit() {
    this.focusable.beFocused();
  }

  validated = false;
  get valid() {
    return !this.validated
      || !this.validatables
      || !this.validatables.length
      || this.validatables.toArray().every(v => v.valid);
  }

  send() {
    this.validated = true;
    if(this.valid) {
      this.emailService.send(new EmailMessage(this.recipients, this.subject, this.body))
                       .subscribe(() => this.router.navigate(this.successLinkParams));
    }
  }
}