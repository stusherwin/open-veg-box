import { Component, OnInit, Input, Output, Inject, forwardRef, ViewChildren, QueryList, EventEmitter, ViewChild, ElementRef, Renderer, ChangeDetectorRef, HostListener, HostBinding } from '@angular/core';
import { EditableService } from './editable.service'

@Component({
  selector: '[cc-button]',
  template: `
    <i class="icon-{{icon}}"></i>{{text}}
  `
})
export class ButtonComponent implements OnInit {
  @Input('right')
  rightAttr: boolean
  @HostBinding('class.button-new-right')
  get isRight() {
    return this.rightAttr != undefined;
  }

  @Input('small')
  smallAttr: boolean
  @HostBinding('class.button-new-small-1')
  get isSmall() {
    return this.smallAttr != undefined;
  }
  @HostBinding('class.button-new')
  get isNotSmall() {
    return !this.isSmall;
  }

  @HostBinding('tabindex')
  tabindex = '1'

  @Input()
  icon: string

  @Input()
  text: string

  @HostListener('click')
  click() {
    this.service.endEdit()
  }

  constructor(
    @Inject(forwardRef(() => EditableService))
    private service: EditableService) {
  }

  ngOnInit() {
  }
}