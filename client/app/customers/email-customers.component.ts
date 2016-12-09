import { Component, OnInit, Input } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router-deprecated';
import { FocusDirective } from '../shared/focus.directive';
import { FocusService } from '../shared/focus.service';

@Component({
  selector: 'cc-email-customers',
  templateUrl: 'app/customers/email-customers.component.html',
  providers: [FocusService],
  directives: [FocusDirective, ROUTER_DIRECTIVES]
})
export class EmailCustomersComponent {
  @Input()
  customers: CustomerEmail[]

  @Input()
  cancelLinkParams: any[]
}

export class CustomerEmail {
  constructor(id: number, name:string, email: string) {
    this.id = id;
    this.name = name;
    this.email = email;
  }
    
  id: number;
  name: string;
  email: string;
}