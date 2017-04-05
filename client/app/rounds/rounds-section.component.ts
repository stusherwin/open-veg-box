import { Component, OnInit, Input } from '@angular/core';
import { RoundsPageComponent } from './rounds-page.component'
import { RoundSectionComponent } from './round-section.component'
import { RouteParams } from '@angular/router-deprecated';
import { RouteConfig, Router, ROUTER_DIRECTIVES } from '@angular/router-deprecated';
import { ErrorNotifyComponent } from '../shared/error-notify.component'
import { RoundService } from './round.service'

@Component({
  selector: 'cc-rounds-section',
  templateUrl: 'app/rounds/rounds-section.component.html',
  directives: [ROUTER_DIRECTIVES, ErrorNotifyComponent],
  providers: [RoundService]
})

@RouteConfig([
  {
    path: '',
    name: 'Rounds',
    component: RoundsPageComponent
  },
  {
    path: ':roundId/...',
    name: 'Round',
    component: RoundSectionComponent
  },
  {
    path: '/*anything-else',
    name: 'NotFound',
    redirectTo: ['./Rounds']
  }
])
export class RoundsSectionComponent {
}