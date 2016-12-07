import { Component, OnInit, Input } from '@angular/core';
import { RoundsHomeComponent } from './rounds-home.component'
import { RoundEmailComponent } from './round-email.component'
import { RouteParams } from '@angular/router-deprecated';
import { RouteConfig, Router, ROUTER_DIRECTIVES } from '@angular/router-deprecated';

@Component({
  selector: 'cc-rounds',
  templateUrl: 'app/rounds/rounds.component.html',
  directives: [ROUTER_DIRECTIVES]
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
    component: RoundEmailComponent
  },
  {
    path: '/*anything-else',
    name: 'NotFound',
    redirectTo: ['RoundsHome']
  }
])
export class RoundsComponent {
}