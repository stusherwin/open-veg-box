import { Component, Input, Provider, forwardRef, OnInit, Output, EventEmitter, HostListener, HostBinding, Renderer, Directive, ElementRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, CORE_DIRECTIVES } from "@angular/common"
import { NgModel } from '@angular/common';

@Directive({
  selector: '[cc-numeric]'
})
export class NumericDirective implements OnInit {
  constructor(private el: ElementRef, private renderer: Renderer) {
  }

  @Input()
  fixedDecimals: number;

  @Input()
  maxDecimals: number;
  
  @Input()
  value: number

  @Output()
  valueChange = new EventEmitter<number>();

  ngOnInit() {
    this.renderer.setElementProperty(this.el.nativeElement, 'value', this.toStringValue(this.value));
  }

  @HostListener('focus')
  onFocus() {
    this.renderer.setElementProperty(this.el.nativeElement, 'value', this.toStringValue(this.value));
  }

  @HostListener('change', ['$event.target.value'])
  onChange(value: any) {
    this.value = this.toDecimalValue(value);
    this.valueChange.emit(this.value);
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

    if(this.fixedDecimals) {
      return parseFloat(parsed.toFixed(this.fixedDecimals));
    }
    
    if (this.maxDecimals) {
      return parseFloat(parsed.toFixed(this.maxDecimals));
    }

    return parsed;
  } 
}