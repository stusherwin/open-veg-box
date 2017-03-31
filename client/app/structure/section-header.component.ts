import { Component, Input } from '@angular/core';
import { NavBarComponent } from './nav-bar.component';
import { ROUTER_DIRECTIVES } from '@angular/router-deprecated';
import { LogoutComponent } from '../auth/logout.component'

@Component({
  selector: 'cc-section-header',
  templateUrl: 'app/structure/section-header.component.html',
  directives: [NavBarComponent, LogoutComponent, ROUTER_DIRECTIVES]
})

export class HeaderComponent {
  @Input()
  showLogout: boolean = true;
}
