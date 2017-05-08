import { Component, Input, Output, EventEmitter, ViewChild, forwardRef, Inject, ElementRef, OnInit, Renderer, ViewChildren, QueryList, Directive, HostListener, HostBinding, AfterViewInit, ContentChildren, ChangeDetectorRef } from '@angular/core';
import { ActiveElementDirective, ActivateOnFocusDirective, DeactivateOnBlurDirective } from './active-elements'
import { EditableService } from './editable.service'

@Component({
  template: `
    <span *ngIf="visible">
      <button class="button-new-small"
        [disabled]="disabled"
        tabindex="1"
        (click)="onOk(false)"
        (keydown.Enter)="onOk(true)">
        <i class="icon-ok"></i>
      </button>
      <a class="button-new-small"
        tabindex="1"
        (click)="onCancel(false)"
        (keydown.Enter)="onCancel(true)"><i class="icon-cancel"></i>
      </a>
    </span>
  `,
  selector: 'cc-editable-buttons'
})
export class EditableButtonsComponent {
  visible: boolean = true

  @Input()
  key: string

  @Input()
  disabled: boolean

  @Output()
  ok = new EventEmitter<boolean>()

  @Output()
  cancel = new EventEmitter<boolean>()

  constructor(
    @Inject(forwardRef(() => EditableService))
    private service: EditableService) {
  }

  onOk(keydown: boolean) {
    if(!this.disabled) {
      this.ok.emit(keydown)
      this.service.endEdit(this.key);
   }
  }

  onCancel(keydown: boolean) {
    this.cancel.emit(keydown)
    this.service.endEdit(this.key);
  }
}