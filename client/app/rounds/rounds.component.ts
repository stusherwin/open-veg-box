import { Component, OnInit, Input } from '@angular/core';
import { RoundsHomeComponent } from './rounds-home.component'
import { EmailRoundComponent } from './email-round.component'
import { RouteParams } from '@angular/router-deprecated';
import { RouteConfig, Router, ROUTER_DIRECTIVES } from '@angular/router-deprecated';
import { ErrorNotifyComponent } from '../shared/error-notify.component'

@Component({
  selector: 'cc-rounds',
  templateUrl: 'app/rounds/rounds.component.html',
  directives: [ROUTER_DIRECTIVES, ErrorNotifyComponent]
})

@RouteConfig([
  {
    path: '',
    name: 'RoundsHome',
    component: RoundsHomeComponent
  },
  {
    path: 'email/:roundId',
    name: 'Email',
    component: EmailRoundComponent
  },
  {
    path: '/*anything-else',
    name: 'NotFound',
    redirectTo: ['RoundsHome']
  }
])
export class RoundsComponent {
}