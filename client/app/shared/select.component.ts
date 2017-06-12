import { Component, Input, Output, EventEmitter, ViewChild, forwardRef, Inject, ElementRef, OnInit, Renderer, ViewChildren, QueryList, Directive, HostListener, HostBinding, AfterViewInit, ContentChildren, ChangeDetectorRef } from '@angular/core';
import { Control, Validators, FORM_DIRECTIVES, FormBuilder, ControlGroup } from '@angular/common'
import { InputComponent, ValidationResult } from './input.component'

@Component({
  template: `
    <select #select class="{{cssClass}}"
            tabindex="1"
            [ngModel]="value"
            (ngModelChange)="valueChange.emit($event)">
      <option *ngFor="let o of options" [ngValue]="getValue(o)">{{getText(o)}}</option>
    </select>
  `,
  selector: 'cc-select'
})
export class SelectComponent extends InputComponent implements OnInit {
  @Input()
  cssClass: string;

  @Input()
  value: any;

  @Input()
  textProperty: string

  @Input()
  valueProperty: string

  @Input()
  options: any[]

  @ViewChild('select')
  select: ElementRef;

  @Output()
  valueChange = new EventEmitter<string>()

  constructor(private renderer: Renderer) {
    super();
  }

  getText(option: any) {
    return this.textProperty ? option[this.textProperty] : option;
  }

  getValue(option: any) {
    return this.valueProperty ? option[this.valueProperty] : option;
  }

  ngOnInit() {
  }

  focus() {
    this.renderer.invokeElementMethod(this.select.nativeElement, 'focus', []);
  }
}