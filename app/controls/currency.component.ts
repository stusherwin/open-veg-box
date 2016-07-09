import { Component, Input, Provider, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, CORE_DIRECTIVES } from "@angular/common"

const noop = () => {};

const CURRENCY_CONTROL_VALUE_ACCESSOR = new Provider( NG_VALUE_ACCESSOR, {
  useExisting: forwardRef(() => CurrencyComponent),
  multi: true
});

@Component({
  selector: 'cc-currency',
  styleUrls: ['app/controls/currency.component.css'],
  template: `
    <div class="currency">
      &pound;
      <input type="text" (blur)="onBlur()" [(ngModel)]="stringValue" tabindex="0" />
    </div>
  `,
  directives: [CORE_DIRECTIVES],
  providers: [CURRENCY_CONTROL_VALUE_ACCESSOR]
})
export class CurrencyComponent implements ControlValueAccessor {
  private _stringValue: string;
  private _decimalValue: number;
  private _onTouchedCallback: () => void = noop;
  private _onChangeCallback: (_:number) => void = noop;

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
    return '' + value.toFixed(2);
  }

  private toDecimalValue(value: string): number {
    var parsed = parseFloat(value);
    if( isNaN(parsed) ) {
      return 0;
    }
    return parsed;
  }
}