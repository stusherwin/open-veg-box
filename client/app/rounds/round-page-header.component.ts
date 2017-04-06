import { Component, OnInit, Input, Renderer } from '@angular/core';
import { Router, ROUTER_DIRECTIVES } from '@angular/router-deprecated';
import { Round } from './round'

@Component({
  selector: 'cc-round-page-header',
  templateUrl: 'app/rounds/round-page-header.component.html',
  directives: [ROUTER_DIRECTIVES]
})
export class RoundPageHeaderComponent {
  constructor(private router: Router) { }

  @Input()
  round: Round

  isCurrent(linkParams: any[]): boolean {
    //router.isRouteActive() isn't working here for some reason :(
    //need to switch to the new router anyway.
    let cleanUp = (s:string) => s.replace(/;[^\/]+\/?$/, '');
    let pathname = cleanUp(this.router.generate(linkParams).toLinkUrl());
    let currentPathname = cleanUp(window.location.pathname);
    return currentPathname == pathname;
  }
}