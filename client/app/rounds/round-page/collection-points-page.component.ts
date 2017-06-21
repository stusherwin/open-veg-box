import { Component, OnInit, Input, Inject, forwardRef } from '@angular/core';
import { RoundCustomersComponent } from './round-customers-new.component';
import { RoundPageService } from './round-page.component'
import { EditableService } from '../../shared/editable.service'
import { RoundService } from '../round.service'
import { Validators } from '@angular/common'
import { EditableTextComponent } from '../../shared/editable-text.component'

@Component({
  selector: 'cc-collection-points-page',
  templateUrl: 'app/rounds/round-page/collection-points-page.component.html',
  directives: [RoundCustomersComponent, EditableTextComponent],
  providers: [/*EditableService*/]
})
export class CollectionPointsPageComponent {
  roundNameValidators = [Validators.required];

  constructor(
    @Inject(forwardRef(() => RoundPageService))
    private page: RoundPageService,
    private roundService: RoundService) {
  }
}