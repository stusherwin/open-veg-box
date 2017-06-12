import { Component, Input, Output, EventEmitter, ViewChild, forwardRef, Inject, ElementRef, OnInit, Renderer, ViewChildren, QueryList, Directive, HostListener, HostBinding, AfterViewInit, ContentChildren, ChangeDetectorRef } from '@angular/core';
import { Control, Validators, FORM_DIRECTIVES, FormBuilder, ControlGroup } from '@angular/common'
import { InputComponent, ValidationResult } from './input.component'
import { DateString } from './dates'

@Component({
  template: `
    <input type="text" class="date-day" #day
           style="margin-left: 10px"
           [(ngModel)]="dayStringValue"
           (ngModelChange)="updateDay($event)"
           [ngFormControl]="control"
           placeholder="DD"
           tabindex="1"
           (focus)="inputFocus.emit($event)"
           (blur)="inputBlur.emit($event)" />
    /
    <input type="text" class="date-month" #month
           [(ngModel)]="monthStringValue"
           (ngModelChange)="updateMonth($event)"
           placeholder="MM"
           tabindex="1"
           (focus)="inputFocus.emit($event)"
           (blur)="inputBlur.emit($event)" />
    /
    <input type="text" class="date-year" #year
           [(ngModel)]="yearStringValue"
           (ngModelChange)="updateYear($event)"
           placeholder="YYYY"
           tabindex="1"
           (focus)="inputFocus.emit($event)"
           (blur)="inputBlur.emit($event)" />
  `,
  selector: 'cc-date',
  directives: [FORM_DIRECTIVES]
})
export class DateComponent extends InputComponent implements OnInit {
  dayStringValue: string = '';
  monthStringValue: string = '';
  yearStringValue: string = '';
  isValid: boolean = true;

  @Input()
  cssClass: string;

  private __valueUpdatingInternally = false;
  private __value: DateString;
  @Input()
  get value(): DateString {
    return this.__value;
  }

  set value(v: DateString) {
    this.__value = v;

    if(!this.__valueUpdatingInternally) {
      if(v) {
        this.dayStringValue = this.toStringValue(v.day, 2);
        this.monthStringValue = this.toStringValue(v.month, 2);
        this.yearStringValue = this.toStringValue(v.year, 4);
      } else {
        this.dayStringValue = '';
        this.monthStringValue = '';
        this.yearStringValue = '';
      }
    }
  }

  @Input()
  control: Control

  @Output()
  valueChange = new EventEmitter<DateString>()

  @Output()
  inputFocus = new EventEmitter<any>()

  @Output()
  inputBlur = new EventEmitter<any>()

  @ViewChild('day')
  day: ElementRef;

  @ViewChild('month')
  month: ElementRef;

  @ViewChild('year')
  year: ElementRef;

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

  updateDay(stringValue: string) {
    this.__valueUpdatingInternally = true;
    this.value = new DateString(this.toDecimalValue(this.yearStringValue), this.toDecimalValue(this.monthStringValue), this.toDecimalValue(stringValue));
    this.valueChange.emit(this.value);
    this.changeDetector.detectChanges();
    setTimeout(() => this.__valueUpdatingInternally = false);
  }

  updateMonth(stringValue: string) {
    this.__valueUpdatingInternally = true;   
    this.value = new DateString(this.toDecimalValue(this.yearStringValue), this.toDecimalValue(stringValue), this.toDecimalValue(this.dayStringValue));
    this.valueChange.emit(this.value);
    this.changeDetector.detectChanges();
    setTimeout(() => this.__valueUpdatingInternally = false);
  }

  updateYear(stringValue: string) {
    this.__valueUpdatingInternally = true;   
    this.value = new DateString(this.toDecimalValue(stringValue), this.toDecimalValue(this.monthStringValue), this.toDecimalValue(this.dayStringValue));
    this.valueChange.emit(this.value);
    this.changeDetector.detectChanges();
    setTimeout(() => this.__valueUpdatingInternally = false);
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
}