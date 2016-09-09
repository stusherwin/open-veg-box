import { Component } from '@angular/core';
import { Router, ROUTER_DIRECTIVES } from '@angular/router-deprecated';
import { UsersService } from '../users/users.service'
import { User } from '../users/user'
import { LogoutComponent } from '../auth/logout.component'

@Component({
  selector: 'cc-home',
  templateUrl: 'app/home/home.component.html',
  directives: [ROUTER_DIRECTIVES, LogoutComponent],
  providers: [UsersService]
})

export class HomeComponent { 
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