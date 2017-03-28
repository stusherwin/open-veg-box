import { Component } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { ProductsPageComponent } from './products/products-page.component';
import { CustomersSectionComponent } from './customers/customers-section.component';
import { CollectionPointsPageComponent } from './collection-points/collection-points-page.component';
import { BoxesPageComponent } from './boxes/boxes-page.component';
import { RoundsSectionComponent } from './rounds/rounds-section.component';
import { RouteConfig, Router, ROUTER_DIRECTIVES } from '@angular/router-deprecated';
import { LoggedInRouterOutlet } from './auth/logged-in-router-outlet';
import { ErrorNotifyComponent } from './shared/error-notify.component'

@Component({
  selector: 'cc-section',
  templateUrl: 'app/section.component.html',
  directives: [LoggedInRouterOutlet, HeaderComponent, ErrorNotifyComponent]
})

@RouteConfig([
  {
    path: 'products',
    name: 'Products',
    component: ProductsPageComponent
  },
  {
    path: 'boxes',
    name: 'Boxes',
    component: BoxesPageComponent
  },
  {
    path: 'customers/...',
    name: 'Customers',
    component: CustomersSectionComponent
  },
  {
    path: 'collection-points',
    name: 'CollectionPoints',
    component: CollectionPointsPageComponent
  },
  {
    path: 'rounds/...',
    name: 'Rounds',
    component: RoundsSectionComponent
  }
])
export class SectionComponent {
}