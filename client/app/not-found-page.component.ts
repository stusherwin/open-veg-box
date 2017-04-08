import { Component } from '@angular/core';
import { HeaderComponent } from './structure/main-header.component';
import { SectionHeaderComponent } from './structure/section-header.component'

@Component({
  selector: 'cc-not-found-page',
  templateUrl: 'app/not-found-page.component.html',
  directives: [HeaderComponent, SectionHeaderComponent]
})
export class NotFoundPageComponent {
}