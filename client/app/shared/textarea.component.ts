import { Component, Input, Output, EventEmitter, ViewChild, forwardRef, Inject, ElementRef, OnInit, Renderer, ViewChildren, QueryList, Directive, HostListener, HostBinding, AfterViewInit, ContentChildren, ChangeDetectorRef } from '@angular/core';
import { Control, Validators, FORM_DIRECTIVES, FormBuilder, ControlGroup } from '@angular/common'
import { InputComponent, ValidationResult } from './input.component'

@Component({
  template: `
    <textarea class="{{cssClass}}" #textarea
          [(ngModel)]="value"
          (ngModelChange)="valueChange.emit($event)"
          [ngFormControl]="control"
          tabindex="1"
          [style.height.px]="height">
    </textarea>
  `,
  selector: 'cc-textarea',
  directives: [FORM_DIRECTIVES]
})
export class TextAreaComponent extends InputComponent implements OnInit {
  isValid: boolean = true;

  @Input()
  cssClass: string;

  @Input()
  value: string;

  @Input()
  control: Control

  @Input()
  height: number = 76;

  @Output()
  valueChange = new EventEmitter<string>()

  @ViewChild('textarea')
  textarea: ElementRef;

  constructor(private renderer: Renderer) {
    super();
  }

  ngOnInit() {
  }

  focus() {
    this.renderer.invokeElementMethod(this.textarea.nativeElement, 'focus', []);
  }
}