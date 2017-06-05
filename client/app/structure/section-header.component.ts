import { Component, Input, OnInit } from '@angular/core';
import { NavBarComponent } from './nav-bar.component';
import { ROUTER_DIRECTIVES } from '@angular/router-deprecated';
import { LogoutComponent } from '../auth/logout.component'
import { ErrorNotifyComponent } from '../shared/error-notify.component'

export class Breadcrumb {
  title: string;
  routerLink: any[]
}

@Component({
  selector: 'cc-section-header',
  templateUrl: 'app/structure/section-header.component.html',
  directives: [NavBarComponent, LogoutComponent, ROUTER_DIRECTIVES, ErrorNotifyComponent]
})

export class SectionHeaderComponent implements OnInit {
  @Input()
  headerIcon: string;

  @Input()
  headerTitle: string;

  @Input()
  headerRouterLink: any[]

  private _breadcrumbs: Breadcrumb[]

  @Input()
  get breadcrumbs(): Breadcrumb[] {
    return this._breadcrumbs;
  }
  set breadcrumbs(value: Breadcrumb[]) {
    this._breadcrumbs = value;
    if(value && !document.body.classList.contains('breadcrumbs')) {
      document.body.classList.add('breadcrumbs')
    } else if(!value && document.body.classList.contains('breadcrumbs')) {
      document.body.classList.remove('breadcrumbs')
    }
  }

  ngOnInit() {
    if(!this.breadcrumbs && document.body.classList.contains('breadcrumbs')) {
      document.body.classList.remove('breadcrumbs')
    }
  }
}
