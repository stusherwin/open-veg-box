import { Component, Directive, Input, ViewChild, ElementRef, Output, EventEmitter, ViewChildren, QueryList, AfterViewInit, ChangeDetectorRef, AfterViewChecked, OnChanges, Inject, forwardRef, OnInit, OnDestroy, Renderer } from '@angular/core';

@Component({
  selector: 'cc-round-customer-remove',
  templateUrl: 'app/rounds/list-page/round-customer-remove.component.html'
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