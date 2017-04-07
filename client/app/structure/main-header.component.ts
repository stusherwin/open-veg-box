import { Component, Input } from '@angular/core';
import { NavBarComponent } from './nav-bar.component';
import { ROUTER_DIRECTIVES } from '@angular/router-deprecated';
import { LogoutComponent } from '../auth/logout.component'

@Component({
  selector: 'cc-main-header',
  templateUrl: 'app/structure/main-header.component.html',
  directives: [NavBarComponent, LogoutComponent, ROUTER_DIRECTIVES]
})

export class HeaderComponent {
}
