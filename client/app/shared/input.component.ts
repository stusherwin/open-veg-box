import { Component, Input, Output, EventEmitter, ViewChild, forwardRef, Inject, ElementRef, OnInit, Renderer, ViewChildren, QueryList, Directive, HostListener, HostBinding, AfterViewInit, ContentChildren, ChangeDetectorRef } from '@angular/core';
import { Control, Validators, FORM_DIRECTIVES, FormBuilder, ControlGroup } from '@angular/common'

export class InputComponent {
  isValid: boolean = true;

  validate(): boolean {
    return true;
  }
}

export interface ValidationResult{
   [key:string]:boolean;
}

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

@Component({
  template: `
    <input type="text" class="{{cssClass}}" #input
          [(ngModel)]="stringValue"
          (ngModelChange)="updateValue($event)"
          [ngFormControl]="control"
          tabindex="1" />
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

  @Output()
  valueChange = new EventEmitter<number>()

  @ViewChild('input')
  input: ElementRef;

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