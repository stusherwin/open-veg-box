import { Component } from '@angular/core';
import { HeaderComponent } from './structure/main-header.component';
import { ErrorNotifyComponent } from './shared/error-notify.component'

@Component({
  selector: 'cc-not-found-page',
  templateUrl: 'app/not-found-page.component.html',
  directives: [HeaderComponent, ErrorNotifyComponent]
})
export class NotFoundPageComponent {
}