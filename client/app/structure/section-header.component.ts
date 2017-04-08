import { Component, Input } from '@angular/core';
import { NavBarComponent } from './nav-bar.component';
import { ROUTER_DIRECTIVES } from '@angular/router-deprecated';
import { LogoutComponent } from '../auth/logout.component'
import { ErrorNotifyComponent } from '../shared/error-notify.component'

@Component({
  selector: 'cc-section-header',
  templateUrl: 'app/structure/section-header.component.html',
  directives: [NavBarComponent, LogoutComponent, ROUTER_DIRECTIVES, ErrorNotifyComponent]
})

export class SectionHeaderComponent {
  @Input()
  headerIcon: string;

  @Input()
  headerTitle: string;

  @Input()
  headerRouterLink: any[]
}
