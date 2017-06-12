import { Component, Input, Output, EventEmitter, ViewChild, forwardRef, Inject, ElementRef, OnInit, Renderer, ViewChildren, QueryList, Directive, HostListener, HostBinding, AfterViewInit, ContentChildren, ChangeDetectorRef } from '@angular/core';
import { Control, Validators, FORM_DIRECTIVES, FormBuilder, ControlGroup } from '@angular/common'
import { InputComponent, ValidationResult } from './input.component'

@Component({
  template: `
    <input type="text" class="{{cssClass}}" #input
          [(ngModel)]="value"
          (ngModelChange)="valueChange.emit($event)"
          [ngFormControl]="control"
          tabindex="1" />
  `,
  selector: 'cc-text',
  directives: [FORM_DIRECTIVES]
})
export class TextComponent extends InputComponent implements OnInit {
  isValid: boolean = true;

  @Input()
  cssClass: string;

  @Input()
  value: string;

  @Input()
  control: Control

  @Input()
  messages: any;

  @Output()
  valueChange = new EventEmitter<string>()

  @ViewChild('input')
  input: ElementRef;

  constructor(private renderer: Renderer) {
    super();
  }

  ngOnInit() {
  }

  focus() {
    this.renderer.invokeElementMethod(this.input.nativeElement, 'focus', []);
  }
}