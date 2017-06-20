import { Component, Input, Output, EventEmitter, ViewChild, forwardRef, Inject, ElementRef, OnInit, Renderer, ViewChildren, QueryList, Directive, HostListener, HostBinding, AfterViewInit, ContentChildren, ChangeDetectorRef } from '@angular/core';
import { Control, Validators, FORM_DIRECTIVES, FormBuilder, ControlGroup, ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS, Validator } from '@angular/common'
import { InputComponent, ValidationResult } from './input.component'

@Component({
  template: `
    <input type="text" class="{{cssClass}}" #input
          [value]="stringValue"
          (change)="updateValue($event.target.value)"
          (keyup)="updateValue($event.target.value)"
          tabindex="1"
          (focus)="inputFocus.emit($event)"
          (blur)="inputBlur.emit($event)"
          [placeholder]="placeholder" />
  `,
  selector: 'cc-number',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NumberComponent),
      multi: true,
    },,
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => NumberComponent),
      multi: true,
    } 
  ]
})
export class NumberComponent extends InputComponent implements OnInit, ControlValueAccessor, Validator {
  stringValue: string;

  @Input()
  cssClass: string;

  @Input()
  fixedDecimals: boolean = false;

  @Input()
  decimalPrecision: number;

  @Input()
  negative: boolean = false;

  @Input()
  required: boolean = false;

  @Input()
  placeholder: string = ''

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
  }

  updateValue(stringValue: string) {
    this.stringValue = stringValue;
    this.propogateChange(this.toDecimalValue(stringValue));
  }

  focus() {
    this.renderer.invokeElementMethod(this.input.nativeElement, 'focus', []);
  }

  private toStringValue(value: number): string {
    if(!value) {
      return '';
    }

    if(this.negative) {
      value = -value;
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

  private toDecimalValue(stringValue: string): number {
    var parsed = parseFloat(stringValue);
    if( isNaN(parsed) ) {
      return undefined;
    }

    if(this.negative && parsed < 0) {
      return 0;
    }

    let value = parseFloat(parsed.toFixed(this.decimalPrecision));

    if(this.negative) {
      value = -value;
    }

    return value;
  }

  private propogateChange = (_: any) => {}

  writeValue(value: number) {
   if(value) {
      this.stringValue = this.toStringValue(value);
    } else {
      this.stringValue = '';
    }
  }

  registerOnChange(fn: any) {
    this.propogateChange = fn;
  }

  registerOnTouched(fn: any) {
  } 
  
  public validate(control: Control): ValidationResult {
    if(!this.stringValue.replace(/\s/g, '').length) {
      return { "required": true };
    }

    if (isNaN(parseFloat(this.stringValue))) {
      return { "notNumeric": true };
    }
 
    return null;
  }

  static isGreaterThanZero(control: Control): ValidationResult { 
    if(control.value == undefined) {
      return null;
    }

    if(control.value <= 0) {
      return { "notGreaterThanZero": true };
    }
 
    return null;
  }

  static isLessThanZero(control: Control): ValidationResult { 
    if(control.value == undefined) {
      return null;
    }

    if(control.value >= 0) {
      return { "notLessThanZero": true };
    }
 
    return null;
  }

  static isNotZero(control: Control): ValidationResult { 
    if(control.value == undefined) {
      return null;
    }

    if(control.value == 0) {
      return { "zero": true };
    }
 
    return null;
  }
}