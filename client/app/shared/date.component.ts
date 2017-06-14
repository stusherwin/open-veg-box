import { Component, Input, Output, EventEmitter, ViewChild, forwardRef, Inject, ElementRef, OnInit, Renderer, ViewChildren, QueryList, Directive, HostListener, HostBinding, AfterViewInit, ContentChildren, ChangeDetectorRef } from '@angular/core';
import { Control, Validators, FORM_DIRECTIVES, FormBuilder, ControlGroup, ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS } from '@angular/common'
import { InputComponent, ValidationResult } from './input.component'
import { DateString } from './dates'

@Component({
  template: `
    <input type="text" class="date-day" #day
           [value]="dayStringValue"
           (change)="updateDay($event.target.value)"
           (keyup)="updateDay($event.target.value)"
           placeholder="DD"
           tabindex="1"
           (focus)="inputFocus.emit($event)"
           (blur)="inputBlur.emit($event)" />
    /
    <input type="text" class="date-month"
           [value]="monthStringValue"
           (change)="updateMonth($event.target.value)"
           (keyup)="updateMonth($event.target.value)"
           placeholder="MM"
           tabindex="1"
           (focus)="inputFocus.emit($event)"
           (blur)="inputBlur.emit($event)" />
    /
    <input type="text" class="date-year"
           [value]="yearStringValue"
           (change)="updateYear($event.target.value)"
           (keyup)="updateYear($event.target.value)"
           placeholder="YYYY"
           tabindex="1"
           (focus)="inputFocus.emit($event)"
           (blur)="inputBlur.emit($event)" />
  `,
  selector: 'cc-date',
  directives: [FORM_DIRECTIVES],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateComponent),
      multi: true,
    }
  ]
})
export class DateComponent extends InputComponent implements OnInit, ControlValueAccessor {
  dayStringValue: string = '';
  monthStringValue: string = '';
  yearStringValue: string = '';
  isValid: boolean = true;

  private get value(): DateString {
    return new DateString(
      this.toDecimalValue(this.yearStringValue),
      this.toDecimalValue(this.monthStringValue),
      this.toDecimalValue(this.dayStringValue))
  }

  @Output()
  inputFocus = new EventEmitter<any>()

  @Output()
  inputBlur = new EventEmitter<any>()

  @ViewChild('day')
  private day: ElementRef;

  constructor(private changeDetector: ChangeDetectorRef, private renderer: Renderer) {
    super();
  }

  ngOnInit() {
    if(this.value) {
      this.dayStringValue = this.toStringValue(this.value.day, 2);
      this.monthStringValue = this.toStringValue(this.value.month, 2);
      this.yearStringValue = this.toStringValue(this.value.year, 4);
    } else {
      this.dayStringValue = '';
      this.monthStringValue = '';
      this.yearStringValue = '';
    }
  }

  private propogateChange = (_: any) => {}

  writeValue(value: DateString) {
   if(value) {
      this.dayStringValue = this.toStringValue(value.day, 2);
      this.monthStringValue = this.toStringValue(value.month, 2);
      this.yearStringValue = this.toStringValue(value.year, 4);
    } else {
      this.dayStringValue = '';
      this.monthStringValue = '';
      this.yearStringValue = '';
    }
  }

  registerOnChange(fn: any) {
    this.propogateChange = fn;
  }

  registerOnTouched(fn: any) {
  }

  updateDay(stringValue: string) {
    this.dayStringValue = stringValue;
    this.propogateChange(this.value);
  }

  updateMonth(stringValue: string) {
    this.monthStringValue = stringValue;
    this.propogateChange(this.value);    
  }

  updateYear(stringValue: string) {
    this.yearStringValue = stringValue;
    this.propogateChange(this.value);
  }

  focus() {
    this.renderer.invokeElementMethod(this.day.nativeElement, 'focus', []);
  }

  private toStringValue(value: number, length: number): string {
    if(!value) {
      return '';
    }

    let result = value.toFixed(0);
    let padLength = length - result.length;
    if(padLength > 0) {
      result = '0'.repeat(padLength) + result;
    }

    return result;
  }

  private toDecimalValue(value: string): number {
    var parsed = parseFloat(value);
    if( isNaN(parsed) ) {
      return 0;
    }

    return parseFloat(parsed.toFixed(0));
  }

  static isValidDate(control: Control): ValidationResult {
    let date = <DateString>control.value;
    if(!date) {
      return null;
    }
    
    if(!date.day || !date.month || !date.year) {
      return {invalidDate: true};
    }
    
    if(Date.parse(date.toString()) == NaN) {
      return {nonExistentDate: true};
    }
 
    return null;
  }

  static isAfter1900(control: Control): ValidationResult {let date = <DateString>control.value;
    if(!date) {
      return null;
    }

    if(date.year < 1900) {
      return {before1900: true};
    }
    
    return null;
  }  
}