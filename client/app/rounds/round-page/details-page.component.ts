import { Component, OnInit, Input, Inject, forwardRef } from '@angular/core';
import { RoundCustomersComponent } from '../list-page/round-customers.component';
import { RoundPageService } from './round-page.component'

@Component({
  selector: 'cc-details-page',
  templateUrl: 'app/rounds/round-page/details-page.component.html',
  directives: [RoundCustomersComponent]
})
export class RoundDetailsPageComponent {
  constructor(
    @Inject(forwardRef(() => RoundPageService))
    private page: RoundPageService) {

    }
}