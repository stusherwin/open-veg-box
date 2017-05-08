import { Component, Input, Output, EventEmitter, ViewChild, forwardRef, Inject, ElementRef, OnInit, Renderer, ViewChildren, QueryList, Directive, HostListener, HostBinding, AfterViewInit, ContentChildren, ChangeDetectorRef } from '@angular/core';
import { ActiveElementDirective, ActivateOnFocusDirective, DeactivateOnBlurDirective } from './active-elements'
import { EditableService } from './editable.service'

@Component({
  template: `
    <a *ngIf="visible" class="button-new-small editable-button"
      tabindex="1"
      (click)="onClick(false)"
      (keydown.Enter)="onClick(true)"><i class="icon-{{icon}}"></i>
    </a>
  `,
  selector: 'cc-editable-button',
  directives: [ActiveElementDirective, ActivateOnFocusDirective, DeactivateOnBlurDirective]
})
export class EditableEditButtonComponent implements OnInit {
  visible: boolean = true

  @Input()
  key: string

  @Input()
  icon: string

  @Input()
  tabindex: number = 9999
  
  @Output()
  click = new EventEmitter<boolean>()

  constructor(
    @Inject(forwardRef(() => EditableService))
    private service: EditableService) {
  }

  ngOnInit() {
  }

  private onClick(keydown: boolean) {
    this.service.startEdit(this.key);
    this.click.emit(keydown);
  }
}