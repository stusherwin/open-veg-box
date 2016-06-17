import { Component, Input } from '@angular/core';
import { ROUTER_DIRECTIVES, Router } from '@angular/router-deprecated';

@Component({
  selector: 'cc-nav-bar-link',
  template: `
  <a [class.selected]="isCurrent()" [routerLink]="linkParams"><ng-content></ng-content></a>
  `,
  directives: [ROUTER_DIRECTIVES]
})

export class NavBarLinkComponent {
  constructor(private router: Router) { }

  @Input()
  text:string = 'PRoducts';
  
  @Input()
  linkParams:any[];
  
  isCurrent() {
    return this.router.isRouteActive(this.router.generate(this.linkParams));
  }
} 