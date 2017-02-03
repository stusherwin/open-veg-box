import { Component, Input, Directive, OnInit, OnDestroy, ElementRef, Inject, forwardRef, HostListener, OnChanges, ChangeDetectorRef, AfterViewChecked, Renderer, EventEmitter, Output } from '@angular/core';
import { FocusDirective } from '../shared/focus.directive';
import { ActiveDirective, ActiveParentDirective, ActiveService, ActivateOnFocusDirective } from '../shared/active-elements';
import { Arrays } from '../shared/arrays';

@Component({
  selector: 'cc-collection-points',
  templateUrl: 'app/collection-points/collection-points.component.html',
  directives: [ActiveParentDirective, ActiveDirective, ActivateOnFocusDirective],
  providers: [ActiveService]
})

export class CollectionPointsComponent { }