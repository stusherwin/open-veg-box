import { Component } from '@angular/core';
import { Router, ROUTER_DIRECTIVES } from '@angular/router-deprecated';
import { UsersService } from '../users/users.service'
import { User } from '../users/user'
import { ButtonComponent } from '../shared/button.component'

@Component({
  selector: 'cc-logout',
  template: `<a cc-button right class="logout" icon="logout" text="Log out" (click)="logout()"></a>`,
  providers: [UsersService],
  directives: [ButtonComponent]
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