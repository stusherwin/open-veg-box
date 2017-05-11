import { Component, OnInit, Input, Inject, forwardRef } from '@angular/core';
import { RoundCustomersComponent } from './round-customers-new.component';
import { RoundPageService } from './round-page.component'
import { EditableService } from '../../shared/editable.service'

@Component({
  selector: 'cc-details-page',
  templateUrl: 'app/rounds/round-page/details-page.component.html',
  directives: [RoundCustomersComponent],
  providers: [EditableService]
})
export class RoundDetailsPageComponent {
  constructor(
    @Inject(forwardRef(() => RoundPageService))
    private page: RoundPageService) {
    }
}