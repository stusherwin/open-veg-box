import { 
  ViewContainerRef, DynamicComponentLoader, AttributeMetadata, Directive, Attribute 
} from '@angular/core';
import { Router, RouterOutlet, ComponentInstruction } from '@angular/router-deprecated';

import { UsersService } from '../users/users.service';

@Directive({
  selector: 'router-outlet'
})
export class LoggedInRouterOutlet extends RouterOutlet {
  publicRoutes: string[];
  private parentRouter: Router;
  private usersService: UsersService;

  constructor(
    _elementRef: ViewContainerRef, _loader: DynamicComponentLoader,
    _parentRouter: Router, @Attribute('name') nameAttr: string,
    private _usersService: UsersService
  ) {
    super(_elementRef, _loader, _parentRouter, nameAttr);

    this.parentRouter = _parentRouter;
    this.publicRoutes = ['login'];
    this.usersService = _usersService;
  }

  activate(instruction: ComponentInstruction) {
    if (this._canActivate(instruction.urlPath)) {
      return super.activate(instruction);
    }

    this.parentRouter.navigate(['Login']);
  }

  _canActivate(url: string) {
    return this.publicRoutes.indexOf(url) !== -1 || this.usersService.getCurrentUser();
  }
}