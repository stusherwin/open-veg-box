import { Component, Input, Output, EventEmitter, ViewChild, forwardRef, Inject, ElementRef, OnInit, Renderer, ViewChildren, QueryList, Directive, HostListener, HostBinding, AfterViewInit, ContentChildren, ChangeDetectorRef } from '@angular/core';
import { Control, Validators, FORM_DIRECTIVES, FormBuilder, ControlGroup } from '@angular/common'

export class InputComponent {
  isValid: boolean = true;

  validate(): boolean {
    return true;
  }
}

interface ValidationResult{
   [key:string]:boolean;
}

@Component({
  template: `
    <input type="text" class="{{cssClass}}"
          [(ngModel)]="value"
          [ngFormControl]="control"
          tabindex="1" />
    <i class="icon-warning" [title]="message"></i>
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

  get message(): string {
    if(!this.control || this.control.valid) {
      return '';
    }

    for(let m in this.messages) {
      if(this.control.errors[m]) {
        return this.messages[m];
      }
    }
  }

  constructor() {
    super();
  }

  ngOnInit() {
  }
}

@Component({
  template: `
    <input #input type="text" class="{{cssClass}}"
          [(ngModel)]="stringValue"
          (ngModelChange)="updateValue($event)"
          [ngFormControl]="control"
          tabindex="1" />
    <i class="icon-warning" [title]="message"></i>
  `,
  selector: 'cc-number',
  directives: [FORM_DIRECTIVES]
})
export class NumberComponent extends InputComponent implements OnInit {
  stringValue: string;
  isValid: boolean = true;

  @Input()
  cssClass: string;

  @Input()
  value: number;

  @Input()
  fixedDecimals: boolean = false;

  @Input()
  decimalPrecision: number;

  @Input()
  control: Control

  @Input()
  messages: any;

  @ViewChild('input')
  input: ElementRef;

  get message(): string {
    if(!this.control || this.control.valid) {
      return '';
    }

    for(let m in this.messages) {
      if(this.control.errors[m]) {
        return this.messages[m];
      }
    }
  }

  @Output()
  valueChange = new EventEmitter<number>()

  constructor(private changeDetector: ChangeDetectorRef, private renderer: Renderer) {
    super();
  }

  ngOnInit() {
    this.stringValue = this.toStringValue(this.value);
  }

  updateValue(stringValue: string) {
    this.value = this.toDecimalValue(stringValue);
    this.valueChange.emit(this.value);
    this.changeDetector.detectChanges();
  }

  focus() {
    this.renderer.invokeElementMethod(this.input.nativeElement, 'focus', []);
  }

  private toStringValue(value: number): string {
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


@Component({
  template: `
    <select #select class="{{cssClass}}"
        tabindex="1"
        [(ngModel)]="value"
        (ngModelChange)="valueChange.emit($event)">
      <option *ngFor="let o of options" [ngValue]="o">{{getText(o)}}</option>
    </select>
  `,
  selector: 'cc-select'
})
export class SelectComponent extends InputComponent implements OnInit {
  @Input()
  cssClass: string;

  @Input()
  value: string;

  @Input()
  textProperty: string

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
    return option[this.textProperty];
  }

  ngOnInit() {
  }

  focus() {
    this.renderer.invokeElementMethod(this.select.nativeElement, 'focus', []);
  }
}