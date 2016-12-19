import { Component } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { ErrorNotifyComponent } from './shared/error-notify.component'

@Component({
  selector: 'cc-not-found',
  templateUrl: 'app/not-found.component.html',
  directives: [HeaderComponent, ErrorNotifyComponent]
})
export class NotFoundComponent {
}