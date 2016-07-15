import { Component } from '@angular/core';
import { NavBarComponent } from './nav-bar.component';

@Component({
  selector: 'cc-header',
  styleUrls: ['app/header/header.component.css'],
  templateUrl: 'app/header/header.component.html',
  directives: [NavBarComponent]
})

export class HeaderComponent { }
