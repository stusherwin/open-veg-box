import { Component } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { ProductsComponent } from './products/products.component';
import { CustomersComponent } from './customers/customers.component';
import { CollectionPointsComponent } from './collection-points/collection-points.component';
import { BoxesComponent } from './boxes/boxes.component';
import { DeliveriesComponent } from './deliveries/deliveries.component';
import { HomeComponent } from './home/home.component';
import { RouteConfig, Router, ROUTER_DIRECTIVES } from '@angular/router-deprecated';

@Component({
  selector: 'cc-app',
  styleUrls: ['app/app.component.css'],
  templateUrl: 'app/app.component.html',
  directives: [ROUTER_DIRECTIVES, HeaderComponent]
})

@RouteConfig([
  {
    path: '',
    name: 'Home',
    component: HomeComponent
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
    path: 'customers',
    name: 'Customers',
    component: CustomersComponent
  },
  {
    path: 'collection-points',
    name: 'CollectionPoints',
    component: CollectionPointsComponent
  },
  {
    path: 'deliveries',
    name: 'Deliveries',
    component: DeliveriesComponent
  }
])

export class AppComponent {
}