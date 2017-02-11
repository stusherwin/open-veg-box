import { Component, HostBinding } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { ProductsComponent } from './products/products.component';
import { CustomersComponent } from './customers/customers.component';
import { CollectionPointsComponent } from './collection-points/collection-points.component';
import { BoxesComponent } from './boxes/boxes.component';
import { RoundsComponent } from './rounds/rounds.component';
import { HomeSectionsComponent } from './home/home-sections.component';
import { LoginComponent } from './home/login.component';
import { RouteConfig, Router, ROUTER_DIRECTIVES, Instruction } from '@angular/router-deprecated';
import { LoggedInRouterOutlet } from './auth/logged-in-router-outlet';
import { PageComponent } from './page.component';
import { NotFoundComponent } from './not-found.component';

@Component({
  selector: 'body',
  templateUrl: 'app/app.component.html',
  directives: [LoggedInRouterOutlet, HeaderComponent]
})

@RouteConfig([
  {
    path: '',
    name: 'Home',
    component: HomeSectionsComponent
  },
  {
    path: 'login',
    name: 'Login',
    component: LoginComponent
  },
  {
    path: '...',
    name: 'Page',
    component: PageComponent
  },
  {
    path: '/*anything-else',
    name: 'NotFound',
    component: NotFoundComponent
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