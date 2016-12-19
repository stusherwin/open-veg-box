import { Component, Input } from '@angular/core';
import { NavBarComponent } from './nav-bar.component';
import { ROUTER_DIRECTIVES, Router } from '@angular/router-deprecated';
import { LogoutComponent } from '../auth/logout.component'

@Component({
  selector: 'cc-header',
  templateUrl: 'app/header/header.component.html',
  directives: [NavBarComponent, LogoutComponent, ROUTER_DIRECTIVES]
})

export class HeaderComponent {
  constructor(private router: Router) { }

  @Input()
  isHome: boolean;

  // isHome() {
  //   return this.router.isRouteActive(this.router.generate(['Home'])) || this.router.isRouteActive(this.router.generate(['Login']));
  // }
}
