import { Component, Directive, Input, ViewChild, ElementRef, Output, EventEmitter, ViewChildren, QueryList, AfterViewInit, ChangeDetectorRef, AfterViewChecked, OnChanges, Inject, forwardRef, OnInit, OnDestroy, Renderer } from '@angular/core';
import { ActiveElementDirective, ActivateOnFocusDirective, DeactivateOnBlurDirective } from '../shared/active-elements';
import { BoxProductsService } from './box-products.service'

@Component({
  selector: 'cc-box-product-remove',
  templateUrl: 'app/boxes/box-product-remove.component.html',
  directives: [ActiveElementDirective, ActivateOnFocusDirective, DeactivateOnBlurDirective]
})
export class BoxProductRemoveComponent implements AfterViewInit {
  @Input()
  editId: string;

  @Input()
  editTabindex: number;

  @ViewChild('remove')
  removeBtn: ElementRef

  @Output()
  remove = new EventEmitter<boolean>();

  constructor(private service: BoxProductsService, private renderer: Renderer) {
  }

  ngAfterViewInit() {
    if(this.service.isActive(this.editId)) {
      this.focus();
    }
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

  onActivate() {
    this.service.setActive(this.editId);
  }
}