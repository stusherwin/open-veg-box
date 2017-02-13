import { Component, Input, Provider, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, CORE_DIRECTIVES } from "@angular/common"

const noop = () => {};

const NUMBER_CONTROL_VALUE_ACCESSOR = new Provider( NG_VALUE_ACCESSOR, {
  useExisting: forwardRef(() => NumberComponent),
  multi: true
});


import {Directive, ElementRef} from '@angular/core';
@Directive({
  selector: '[numeric]'
})
export class NumericDirective {
  constructor(private el: ElementRef) {}
  @Input()
  fixedDecimals: number = null
  
  @Input()
  maxDecimals: number = null

  ngAfterViewInit() {
    this.el.nativeElement.onfocus = () => this.reformat.apply(this);
  }

  private reformat() {
    this.el.nativeElement.value = this.toStringValue(this.toDecimalValue(this.el.nativeElement.value));
  }

  private toStringValue(value: number): string {
    if(this.fixedDecimals) {
      return value.toFixed(this.fixedDecimals);
    } else if(this.maxDecimals) {
      var result = value.toFixed(this.maxDecimals);
      while (result !== '0' && (result.endsWith('.') || (result.indexOf('.') != -1 && result.endsWith('0')))) {
        result = result.substring(0, result.length - 1);
      }
      return result;
    } else {
      return '' + value;
    }
  }

  private toDecimalValue(value: string): number {
    var parsed = parseFloat(value);
    if( isNaN(parsed) ) {
      return 0;
    }
    return parsed;
  }
}

@Component({
  selector: 'cc-number',
  template: '<input type="text" (blur)="onBlur()" [(ngModel)]="stringValue" tabindex="0" numeric />',
  directives: [CORE_DIRECTIVES, NumericDirective],
  providers: [NUMBER_CONTROL_VALUE_ACCESSOR]
})
export class NumberComponent implements ControlValueAccessor {
  private _stringValue: string;
  private _decimalValue: number;
  private _onTouchedCallback: () => void = noop;
  private _onChangeCallback: (_:number) => void = noop;

  @Input()
  fixedDecimals: number = null
  
  @Input()
  maxDecimals: number = null

  @Input()
  get stringValue() {
    return this._stringValue;
  }
  set stringValue(v:string) {
    if ( v !== this._stringValue) {
      this._stringValue = v;
      this._decimalValue = this.toDecimalValue(v);
      this._onChangeCallback(this._decimalValue);
    }
  }

  onBlur() {
    this._stringValue = this.toStringValue(this._decimalValue);
    this._onTouchedCallback();
  }

  writeValue(value: any) {
    this._decimalValue = typeof(value) == "number" ? value : 0;
    this._stringValue = this.toStringValue(this._decimalValue);
  }

  registerOnChange(fn: any) {
    this._onChangeCallback = fn;
  }

  registerOnTouched(fn: any) {
    this._onTouchedCallback = fn;
  }

  private toStringValue(value: number): string {
    if(this.fixedDecimals) {
      return value.toFixed(this.fixedDecimals);
    } else if(this.maxDecimals) {
      var result = value.toFixed(this.maxDecimals);
      while (result !== '0' && (result.endsWith('.') || (result.indexOf('.') != -1 && result.endsWith('0')))) {
        result = result.substring(0, result.length - 1);
      }
      return result;
    } else {
      return '' + value;
    }
  }

  private toDecimalValue(value: string): number {
    var parsed = parseFloat(value);
    if( isNaN(parsed) ) {
      return 0;
    }
    return parsed;
  }
}