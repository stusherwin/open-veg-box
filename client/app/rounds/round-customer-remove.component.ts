import { Component, Directive, Input, ViewChild, ElementRef, Output, EventEmitter, ViewChildren, QueryList, AfterViewInit, ChangeDetectorRef, AfterViewChecked, OnChanges, Inject, forwardRef, OnInit, OnDestroy, Renderer } from '@angular/core';
import { ActiveElementDirective, ActiveService, ActivateOnFocusDirective, DeactivateOnBlurDirective } from '../shared/active-elements';

@Component({
  selector: 'cc-round-customer-remove',
  templateUrl: 'app/rounds/round-customer-remove.component.html',
  directives: [ActivateOnFocusDirective, ActiveElementDirective, DeactivateOnBlurDirective]
})
export class RoundCustomerRemoveComponent {
  @ViewChild('remove')
  removeBtn: ElementRef

  @Output()
  remove = new EventEmitter<boolean>();

  constructor(private renderer: Renderer) {
  }

  onClick(keyboard: boolean) {
    this.remove.emit(keyboard);
  }

  onKeyDown(event: KeyboardEvent) {
    if(event.key == 'Enter') {
      this.onClick(true);
    }
  }

  focus() {
    this.renderer.invokeElementMethod(this.removeBtn.nativeElement, 'focus', []);
  }
}