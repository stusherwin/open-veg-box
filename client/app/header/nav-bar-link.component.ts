import { Component, Input, AfterViewInit } from '@angular/core';
import { ROUTER_DIRECTIVES, Router } from '@angular/router-deprecated';

@Component({
  selector: 'cc-nav-bar-link',
  template: `
    <a class="new" [class.selected]="isCurrent()" [routerLink]="linkParams">
      <i class="icon-{{icon}}"></i>{{text}}
    </a>
  `,
  directives: [ROUTER_DIRECTIVES]
})

export class NavBarLinkComponent {
  constructor(private router: Router) { }

  @Input()
  icon: string;

  @Input()
  text: string;

  @Input()
  linkParams:any[];

  isCurrent() {
    return this.router.isRouteActive(this.router.generate(this.linkParams));
  }
} 