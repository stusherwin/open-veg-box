import { Component } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { ProductsComponent } from './products/products.component';
import { CustomersComponent } from './customers/customers.component';
import { CollectionPointsComponent } from './collection-points/collection-points.component';
import { BoxesComponent } from './boxes/boxes.component';
import { RoundsComponent } from './rounds/rounds.component';
import { RouteConfig, Router, ROUTER_DIRECTIVES } from '@angular/router-deprecated';
import { LoggedInRouterOutlet } from './auth/logged-in-router-outlet';
import { ErrorNotifyComponent } from './shared/error-notify.component'

@Component({
  selector: 'cc-page',
  templateUrl: 'app/page.component.html',
  directives: [LoggedInRouterOutlet, HeaderComponent, ErrorNotifyComponent]
})

@RouteConfig([
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
  }
])
export class PageComponent {
}