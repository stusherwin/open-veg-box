import { Component } from '@angular/core';
import { Router, ROUTER_DIRECTIVES } from '@angular/router-deprecated';
import { UsersService } from '../users/users.service'
import { User } from '../users/user'
import { ErrorNotifyComponent } from '../shared/error-notify.component'
import { HeaderComponent } from '../header/header.component';

@Component({
  templateUrl: 'app/home/login-page.component.html',
  directives: [ROUTER_DIRECTIVES, ErrorNotifyComponent, HeaderComponent],
  providers: [UsersService]
})

export class LoginPageComponent { 
  usersService: UsersService;
  router: Router;
  invalidLogin: boolean = false;

  constructor(usersService: UsersService, router: Router) {
    this.usersService = usersService;
    this.router = router;
  }

  currentUser() {
    return this.usersService.getCurrentUser();
  }

  login(username: string, password: string) {
    this.invalidLogin = false;
    
    this.usersService.login(username, password).subscribe(
      _ => { this.invalidLogin = false; this.router.navigate(['Home']); },
      e => { if(e.status == 401) {
        this.invalidLogin = true;
      } }
    );
  }
} 