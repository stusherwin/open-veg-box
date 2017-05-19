import { Component, OnInit, Input, Inject, forwardRef } from '@angular/core';
import { RoundCustomersComponent } from './round-customers-new.component';
import { RoundPageService } from './round-page.component'
import { EditableService } from '../../shared/editable.service'

@Component({
  selector: 'cc-customers-page',
  templateUrl: 'app/rounds/round-page/customers-page.component.html',
  directives: [RoundCustomersComponent],
  providers: [EditableService]
})
export class RoundCustomersPageComponent {
  constructor(
    @Inject(forwardRef(() => RoundPageService))
    private page: RoundPageService) {
    }
}