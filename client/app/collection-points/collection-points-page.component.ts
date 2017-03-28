import { Component, Input, Directive, OnInit, OnDestroy, ElementRef, Inject, forwardRef, HostListener, OnChanges, ChangeDetectorRef, AfterViewChecked, Renderer, EventEmitter, Output } from '@angular/core';
import { ActiveElementDirective, ActiveService, ActivateOnFocusDirective } from '../shared/active-elements';
import { Arrays } from '../shared/arrays';

@Component({
  selector: 'cc-collection-points-page',
  templateUrl: 'app/collection-points/collection-points-page.component.html',
  directives: [ActiveElementDirective, ActivateOnFocusDirective],
  providers: [ActiveService]
})

export class CollectionPointsPageComponent { }