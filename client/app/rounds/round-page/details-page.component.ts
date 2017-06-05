import { Component, OnInit, Input, Inject, forwardRef } from '@angular/core';
import { RoundCustomersComponent } from './round-customers-new.component';
import { RoundPageService } from './round-page.component'
import { EditableService } from '../../shared/editable.service'
import { RoundService } from '../round.service'
import { Validators } from '@angular/common'
import { EditableTextComponent } from '../../shared/editable-text.component'

@Component({
  selector: 'cc-details-page',
  templateUrl: 'app/rounds/round-page/details-page.component.html',
  directives: [RoundCustomersComponent, EditableTextComponent],
  providers: [/*EditableService*/]
})
export class RoundDetailsPageComponent {
  roundNameValidators = [Validators.required];

  constructor(
    @Inject(forwardRef(() => RoundPageService))
    private page: RoundPageService,
    private roundService: RoundService) {
  }

  update(name: string) {
    this.roundService.update(this.page.round.id, {name}).subscribe(() => {});
  }
}