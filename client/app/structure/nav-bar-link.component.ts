import { Component, Input, AfterViewInit, HostBinding } from '@angular/core';
import { ROUTER_DIRECTIVES, Router } from '@angular/router-deprecated';

@Component({
  selector: 'cc-nav-bar-link',
  template: `
    <a class="button-new" tabindex="1" [routerLink]="linkParams">
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

  @HostBinding('class.current')
  get isCurrent(): boolean {
    return this.router.isRouteActive(this.router.generate(this.linkParams));
  }
} 