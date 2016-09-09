import { Component } from '@angular/core';
import { Router, ROUTER_DIRECTIVES } from '@angular/router-deprecated';
import { UsersService } from '../users/users.service'
import { User } from '../users/user'

@Component({
  selector: 'cc-logout',
  template: `
    <button class="logout-button" type="button" (click)="logout()">
      <div class="icon"><i class="icon-logout"></i></div>
      <span>Log out</span>
    </button>`,
  providers: [UsersService]
})

export class LogoutComponent { 
  usersService: UsersService;
  router: Router;

  constructor(usersService: UsersService, router: Router) {
    this.usersService = usersService;
    this.router = router;
  }

  logout() {
    this.usersService.logout().subscribe(_ => this.router.navigate(['Login']));
  }
} 