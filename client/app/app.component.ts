import { Component, HostBinding } from '@angular/core';
import { HeaderComponent } from './structure/main-header.component';
import { HomeSectionsPageComponent } from './home/home-sections-page.component';
import { LoginPageComponent } from './home/login-page.component';
import { RouteConfig, Router, ROUTER_DIRECTIVES, Instruction } from '@angular/router-deprecated';
import { LoggedInRouterOutlet } from './auth/logged-in-router-outlet';
import { SectionComponent } from './structure/section.component';
import { NotFoundPageComponent } from './not-found-page.component';

@Component({
  selector: 'body',
  templateUrl: 'app/app.component.html',
  directives: [LoggedInRouterOutlet, HeaderComponent]
})

@RouteConfig([
  {
    path: '',
    name: 'Home',
    component: HomeSectionsPageComponent
  },
  {
    path: 'login',
    name: 'Login',
    component: LoginPageComponent
  },
  {
    path: '...',
    name: 'Section',
    component: SectionComponent
  },
  {
    path: '/*anything-else',
    name: 'NotFound',
    component: NotFoundPageComponent
  }
])

export class AppComponent {
  @HostBinding('class.home')
  get isHome(): boolean {
    return this.router.isRouteActive(this.router.generate(['Home']))
        || this.router.isRouteActive(this.router.generate(['Login']));
  }

  constructor(private router: Router) {
  }
}