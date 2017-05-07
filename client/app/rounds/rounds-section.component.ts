import { Component, OnInit, Input } from '@angular/core';
import { ListPageComponent } from './list-page/list-page.component'
import { RoundPageComponent } from './round-page/round-page.component'
import { RouteParams } from '@angular/router-deprecated';
import { RouteConfig, Router, ROUTER_DIRECTIVES } from '@angular/router-deprecated';
import { ErrorNotifyComponent } from '../shared/error-notify.component'
import { RoundService } from './round.service'
import { EditableService } from '../shared/editable.service'

@Component({
  selector: 'cc-rounds-section',
  templateUrl: 'app/rounds/rounds-section.component.html',
  directives: [ROUTER_DIRECTIVES, ErrorNotifyComponent],
  providers: [RoundService, EditableService]
})

@RouteConfig([
  {
    path: '',
    name: 'Rounds',
    component: ListPageComponent
  },
  {
    path: ':roundId/...',
    name: 'Round',
    component: RoundPageComponent
  }
])
export class RoundsSectionComponent {
}