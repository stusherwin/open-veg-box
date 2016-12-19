import { Component } from '@angular/core';
import { Router, ROUTER_DIRECTIVES } from '@angular/router-deprecated';
import { UsersService } from '../users/users.service'
import { User } from '../users/user'
import { HeaderComponent } from '../header/header.component';
import { LogoutComponent } from '../auth/logout.component'
import { ErrorNotifyComponent } from '../shared/error-notify.component'

@Component({
  selector: 'cc-home',
  templateUrl: 'app/home/home-sections.component.html',
  directives: [ROUTER_DIRECTIVES, HeaderComponent, LogoutComponent, ErrorNotifyComponent],
  providers: [UsersService]
})

export class HomeSectionsComponent { 
  usersService: UsersService;
  router: Router;

  constructor(usersService: UsersService, router: Router) {
    this.usersService = usersService;
    this.router = router;
  }

  currentUser() {
    return this.usersService.getCurrentUser();
  }
} 