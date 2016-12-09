import { Component } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { ProductsComponent } from './products/products.component';
import { CustomersComponent } from './customers/customers.component';
import { CollectionPointsComponent } from './collection-points/collection-points.component';
import { BoxesComponent } from './boxes/boxes.component';
import { RoundsComponent } from './rounds/rounds.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './auth/login.component';
import { RouteConfig, Router, ROUTER_DIRECTIVES } from '@angular/router-deprecated';
import { LoggedInRouterOutlet } from './auth/logged-in-router-outlet';

@Component({
  selector: 'cc-app',
  templateUrl: 'app/app.component.html',
  directives: [LoggedInRouterOutlet, HeaderComponent]
})

@RouteConfig([
  {
    path: '',
    name: 'Home',
    component: HomeComponent
  },
  {
    path: 'login',
    name: 'Login',
    component: LoginComponent
  },
  {
    path: 'products',
    name: 'Products',
    component: ProductsComponent
  },
  {
    path: 'boxes',
    name: 'Boxes',
    component: BoxesComponent
  },
  {
    path: 'customers/...',
    name: 'Customers',
    component: CustomersComponent
  },
  {
    path: 'collection-points',
    name: 'CollectionPoints',
    component: CollectionPointsComponent
  },
  {
    path: 'rounds/...',
    name: 'Rounds',
    component: RoundsComponent
  },
  {
    path: '/*anything-else',
    name: 'NotFound',
    redirectTo: ['Home']
  }
])

export class AppComponent {
}