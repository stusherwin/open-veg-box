import { Component, Input, Output, EventEmitter, ViewChild, forwardRef, Inject, ElementRef, OnInit, Renderer, ViewChildren, QueryList, Directive, HostListener, HostBinding, AfterViewInit, ContentChildren, ChangeDetectorRef } from '@angular/core';
import { ActiveElementDirective, ActivateOnFocusDirective, DeactivateOnBlurDirective } from './active-elements'

@Component({
  template: `
    <a #button class="button-new-small editable-button"
      tabindex="1"
      (click)="onClick(false)"
      (keydown.Enter)="onClick(true)"
      (focus)="focus.emit(null)"
      (blur)="blur.emit(null)"><i class="icon-{{icon}}"></i>
    </a>
  `,
  selector: 'cc-editable-button',
  directives: [ActiveElementDirective, ActivateOnFocusDirective, DeactivateOnBlurDirective]
})
export class EditableEditButtonComponent implements OnInit {
  @Input()
  key: string

  @Input()
  icon: string

  @Input()
  tabindex: number = 9999
  
  @Output()
  click = new EventEmitter<boolean>()
  
  @Output()
  focus = new EventEmitter<any>()
  
  @Output()
  blur = new EventEmitter<any>()

  @ViewChild('button')
  button: ElementRef;

  constructor(private renderer: Renderer) {
  }
 
  ngOnInit() {
  }

  private onClick(keydown: boolean) {
    this.click.emit(keydown);
  }

  takeFocus() {
    this.renderer.invokeElementMethod(this.button.nativeElement, 'focus', [])
  }
}