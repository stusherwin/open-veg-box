import { Component, Input, Output, EventEmitter, Provider, forwardRef, OnInit, ChangeDetectorRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, CORE_DIRECTIVES, Control, Validators } from "@angular/common"

const noop = () => {};

const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR = new Provider( NG_VALUE_ACCESSOR, {
  useExisting: forwardRef(() => CurrencyComponent),
  multi: true
});

@Component({
  selector: 'cc-currency',
  template: `
        <input type="text" class="form-control" (blur)="onTouched()" [(ngModel)]="value" />
  `,
  // <input type="text" class="form-control" (blur)="onTouched()" [ngModel]="valueText" (ngModelChange)="valueTextChanged($event)" pattern="ABC" />
  // pattern="([0-9]+)(\.[0-9][0-9]?)?"
  directives: [CORE_DIRECTIVES],
  providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR]
})
export class CurrencyComponent implements ControlValueAccessor, OnInit {
  private _value: number;
  //private valueText: string;

  private _onTouchedCallback: () => void = noop;
  private _onChangeCallback: (_:any) => void = noop;

  // private valueTextChanged(event: any) {
  //   this.valueText = event;
  //   var parsed = parseFloat(event) 
  //   if (this.valueText == '' + parsed) {
  //     this._value = parsed;
  //     this.valueChange.emit(this._value);
  //   }
  // }

  ngOnInit() {
  }

  @Input() formCtrl: any;
  @Input() inputField: string;
  @Input()
  get value() {
    return this._value;
  }
  set value(v: number) {
    if ( v !== this._value) {
      this._value = v;
      //this.valueText = '' + v;
      this._onChangeCallback(v);
    }
  }

  onTouched() {
    this._onTouchedCallback();
  }

  writeValue(value: any) {
    this._value = value;
  }

  registerOnChange(fn: any) {
    this._onChangeCallback = fn;
  }

  registerOnTouched(fn: any) {
    this._onTouchedCallback = fn;
  }

  // @Output()
  // valueChange = new EventEmitter<number>();
}