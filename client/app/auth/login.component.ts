import { Component } from '@angular/core';
import { Router, ROUTER_DIRECTIVES } from '@angular/router-deprecated';
import { UsersService } from '../users/users.service'
import { User } from '../users/user'

@Component({
  selector: 'cc-login',
  templateUrl: 'app/auth/login.component.html',
  directives: [ROUTER_DIRECTIVES],
  providers: [UsersService]
})

export class LoginComponent { 
  usersService: UsersService;
  router: Router;

  constructor(usersService: UsersService, router: Router) {
    this.usersService = usersService;
    this.router = router;
  }

  currentUser() {
    return this.usersService.getCurrentUser();
  }

  login(username: string, password: string) {
    this.usersService.login(username, password).subscribe(_ => this.router.navigate(['Home']));
  }
} 