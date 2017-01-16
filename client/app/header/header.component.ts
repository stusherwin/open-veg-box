import { Component, Input } from '@angular/core';
import { NavBarComponent } from './nav-bar.component';
import { ROUTER_DIRECTIVES } from '@angular/router-deprecated';
import { LogoutComponent } from '../auth/logout.component'

@Component({
  selector: 'cc-header',
  templateUrl: 'app/header/header.component.html',
  directives: [NavBarComponent, LogoutComponent, ROUTER_DIRECTIVES]
})

export class HeaderComponent {
  @Input()
  showLogout: boolean = true;
}
