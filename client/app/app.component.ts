import { Component } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { ProductsComponent } from './products/products.component';
import { CustomersComponent } from './customers/customers.component';
import { CollectionPointsComponent } from './collection-points/collection-points.component';
import { BoxesComponent } from './boxes/boxes.component';
import { RoundsComponent } from './rounds/rounds.component';
import { HomeSectionsComponent } from './home/home-sections.component';
import { LoginComponent } from './home/login.component';
import { RouteConfig, Router, ROUTER_DIRECTIVES } from '@angular/router-deprecated';
import { LoggedInRouterOutlet } from './auth/logged-in-router-outlet';
import { PageComponent } from './page.component';
import { NotFoundComponent } from './not-found.component';
import { ClickOutsideDirective } from './shared/click-outside.directive';

@Component({
  selector: 'cc-app',
  templateUrl: 'app/app.component.html',
  directives: [LoggedInRouterOutlet, HeaderComponent, ClickOutsideDirective]
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
}