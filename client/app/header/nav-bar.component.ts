import { Component } from '@angular/core';
import { NavBarLinkComponent } from './nav-bar-link.component';

@Component({
  selector: 'cc-nav-bar',
  styleUrls: ['app/header/nav-bar.component.css'],
  templateUrl: 'app/header/nav-bar.component.html',
  directives: [NavBarLinkComponent]
})

export class NavBarComponent { } 