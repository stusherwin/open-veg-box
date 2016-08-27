import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router-deprecated';
import { UsersService } from '../users/users.service'
import { User } from '../users/user'

@Component({
  selector: 'cc-home',
  templateUrl: 'app/home/home.component.html',
  directives: [ROUTER_DIRECTIVES],
  providers: [UsersService]
})

export class HomeComponent { 
  usersService: UsersService;

  constructor(usersService: UsersService) {
    this.usersService = usersService;
  }

  currentUser: User;

  login(username: string, password: string) {
    this.usersService.login(username, password).subscribe(u => {
      this.currentUser = u;
    } );
  }

  logout() {
    this.usersService.logout().subscribe(u => {
      this.currentUser = u;
    } );
  }

  ngOnInit() {
    this.usersService.getCurrent().subscribe(u => {
      this.currentUser = u;
    } );
  }
} 