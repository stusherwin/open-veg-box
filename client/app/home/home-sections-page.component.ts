import { Component } from '@angular/core';
import { Router, ROUTER_DIRECTIVES } from '@angular/router-deprecated';
import { UsersService } from '../users/users.service'
import { User } from '../users/user'
import { HeaderComponent } from '../structure/main-header.component';
import { LogoutComponent } from '../auth/logout.component'
import { ErrorNotifyComponent } from '../shared/error-notify.component'

@Component({
  selector: 'cc-home-sections-page',
  templateUrl: 'app/home/home-sections-page.component.html',
  directives: [ROUTER_DIRECTIVES, HeaderComponent, LogoutComponent, ErrorNotifyComponent],
  providers: [UsersService]
})

export class HomeSectionsPageComponent { 
  usersService: UsersService;
  router: Router;

  constructor(usersService: UsersService, router: Router) {
    this.usersService = usersService;
    this.router = router;
  }

  currentUser(): User {
    return this.usersService.getCurrentUser();
  }
} 