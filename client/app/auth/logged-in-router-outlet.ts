import { ViewContainerRef, DynamicComponentLoader, AttributeMetadata, Directive, Attribute } from '@angular/core';
import { Router, RouterOutlet, ComponentInstruction } from '@angular/router-deprecated';
import { UsersService } from '../users/users.service';

@Directive({
  selector: 'router-outlet'
})
export class LoggedInRouterOutlet extends RouterOutlet {
  private publicRoutes: string[] = ['login']; 

  constructor(
    elementRef: ViewContainerRef,
    loader: DynamicComponentLoader,
    private router: Router,
    @Attribute('name') nameAttr: string,
    private usersService: UsersService
  ) {
    super(elementRef, loader, router, nameAttr);
  }

  activate(instruction: ComponentInstruction) {
    if (this.canActivate(instruction.urlPath)) {
      return super.activate(instruction);
    }

    this.router.navigate(['Login']);
  }

  private canActivate(url: string) {
    return this.publicRoutes.indexOf(url) !== -1 || this.usersService.isLoggedIn();
  }
}