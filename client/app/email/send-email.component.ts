import { Component, Input, AfterViewInit, ViewChild, ViewChildren, QueryList, ElementRef, Renderer } from '@angular/core';
import { ROUTER_DIRECTIVES, Router } from '@angular/router-deprecated';
import { EmailService, EmailMessage, EmailRecipient } from '../email/email.service';
import { ValidatableComponent } from '../shared/validatable.component';
import { ActiveService, ActiveElementDirective, ActivateOnFocusDirective, DeactivateOnBlurDirective } from '../shared/active-elements'

@Component({
  selector: 'cc-send-email',
  templateUrl: 'app/email/send-email.component.html',
  providers: [EmailService, ActiveService],
directives: [ROUTER_DIRECTIVES, ValidatableComponent, ActiveElementDirective, ActivateOnFocusDirective, DeactivateOnBlurDirective]
})
export class SendEmailComponent implements AfterViewInit {
  constructor(private emailService: EmailService, private router: Router, private renderer: Renderer) {
  }

  @Input()
  recipients: EmailRecipient[]

  subject: string = '';
  body: string = '';

  @Input()
  cancelLinkParams: any[]

  @Input()
  successLinkParams: any[]

  @ViewChild('input')
  input: ElementRef

  @ViewChildren(ValidatableComponent)
  validatables: QueryList<ValidatableComponent>

  ngAfterViewInit() {
    this.renderer.invokeElementMethod(this.input.nativeElement, 'focus', [])
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