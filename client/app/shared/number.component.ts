import { Component, Input, Output, EventEmitter, ViewChild, forwardRef, Inject, ElementRef, OnInit, Renderer, ViewChildren, QueryList, Directive, HostListener, HostBinding, AfterViewInit, ContentChildren, ChangeDetectorRef } from '@angular/core';
import { Control, Validators, FORM_DIRECTIVES, FormBuilder, ControlGroup } from '@angular/common'
import { InputComponent, ValidationResult } from './input.component'

@Component({
  template: `
    <input type="text" class="{{cssClass}}" #input
          [(ngModel)]="stringValue"
          (ngModelChange)="updateValue($event)"
          [ngFormControl]="control"
          tabindex="1"
          (focus)="inputFocus.emit($event)"
          (blur)="inputBlur.emit($event)"
          [placeholder]="placeholder" />
  `,
  selector: 'cc-number',
  directives: [FORM_DIRECTIVES]
})
export class NumberComponent extends InputComponent implements OnInit {
  stringValue: string;
  isValid: boolean = true;

  @Input()
  cssClass: string;

  private __valueUpdatingInternally = false;
  private __value: number;
  @Input()
  get value(): number {
    return this.__value;
  }
  set value(v: number) {
    this.__value = v;
    if(!this.__valueUpdatingInternally) {
      this.stringValue = this.toStringValue(v);
    }
  }

  @Input()
  fixedDecimals: boolean = false;

  @Input()
  decimalPrecision: number;

  @Input()
  control: Control

  @Input()
  placeholder: string = ''

  @Output()
  valueChange = new EventEmitter<number>()

  @Output()
  inputFocus = new EventEmitter<any>()

  @Output()
  inputBlur = new EventEmitter<any>()

  @ViewChild('input')
  input: ElementRef;

  constructor(private changeDetector: ChangeDetectorRef, private renderer: Renderer) {
    super();
  }

  ngOnInit() {
    this.stringValue = this.toStringValue(this.value);
  }

  updateValue(stringValue: string) {
    this.__valueUpdatingInternally = true;
    this.value = this.toDecimalValue(stringValue);
    this.valueChange.emit(this.value);
    this.changeDetector.detectChanges();
    setTimeout(() => this.__valueUpdatingInternally = false);
 }

  focus() {
    this.renderer.invokeElementMethod(this.input.nativeElement, 'focus', []);
  }

  private toStringValue(value: number): string {
    if(!value) {
      return '';
    }

    if(this.fixedDecimals) {
      return value.toFixed(this.decimalPrecision);
    }

    var result = value.toFixed(this.decimalPrecision);
    while (result !== '0' && (result.endsWith('.') || (result.indexOf('.') != -1 && result.endsWith('0')))) {
      result = result.substring(0, result.length - 1);
    }
    return result;
  }

  private toDecimalValue(value: string): number {
    var parsed = parseFloat(value);
    if( isNaN(parsed) ) {
      return 0;
    }

    return parseFloat(parsed.toFixed(this.decimalPrecision));
  }

  static isGreaterThanZero(control: Control): ValidationResult { 
    if (parseFloat(control.value) <= 0) {
      return { "notGreaterThanZero": true };
    }
 
    return null;
  }

  static isNumeric(control: Control): ValidationResult { 
    if (isNaN(parseFloat(control.value))) {
      return { "notNumeric": true };
    }
 
    return null;
  }
}