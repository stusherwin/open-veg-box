import { Component } from '@angular/core';
import { NavBarComponent } from './nav-bar.component';
import { ROUTER_DIRECTIVES, Router } from '@angular/router-deprecated';

@Component({
  selector: 'cc-header',
  styleUrls: ['app/header/header.component.css'],
  templateUrl: 'app/header/header.component.html',
  directives: [NavBarComponent, ROUTER_DIRECTIVES]
})

export class HeaderComponent {
  constructor(private router: Router) { }

  isHome() {
    return this.router.isRouteActive(this.router.generate(['Home'])) || this.router.isRouteActive(this.router.generate(['Login']));
  }
}
