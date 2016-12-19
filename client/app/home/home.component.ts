import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { HomeSectionsComponent } from './home-sections.component';
import { LoginComponent } from './login.component';
import { RouteConfig, Router, ROUTER_DIRECTIVES } from '@angular/router-deprecated';
import { LoggedInRouterOutlet } from '../auth/logged-in-router-outlet';

@Component({
  selector: 'cc-app',
  templateUrl: 'app/home/home.component.html',
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
  }
])
export class HomeComponent {
}