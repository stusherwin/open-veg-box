import { Input, OnInit, Output, EventEmitter, HostListener, HostBinding, Renderer, Directive, ElementRef, OnChanges } from '@angular/core';

@Directive({
  selector: '[cc-numeric]'
})
export class NumericDirective implements OnInit, OnChanges {
  respondingToUserInput = false;
  respondingToUserInputTimer: any;

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
    this.respondingToUserInput = false;
    this.renderer.setElementProperty(this.el.nativeElement, 'value', this.toStringValue(this.value));
  }

  ngOnChanges() {
    //TODO: This is horrible but there's no way to distingush OnChanges event fired by setting value programmatically
    //vs. from valueChanged being fired as a result of user input.
    if(!this.respondingToUserInput) {
      this.renderer.setElementProperty(this.el.nativeElement, 'value', this.toStringValue(this.value));
    }
  }

  @HostListener('blur', ['$event.target.value'])
  onBlur(value: any) {
    this.renderer.setElementProperty(this.el.nativeElement, 'value', this.toStringValue(this.toDecimalValue(value)));
  }

  @HostListener('change', ['$event.target.value'])
  onChange(value: any) {
    if(this.respondingToUserInput && this.respondingToUserInputTimer) {
      clearTimeout(this.respondingToUserInputTimer);
    }
    
    this.respondingToUserInput = true;
    this.respondingToUserInputTimer = setTimeout(() => this.respondingToUserInput = false, 100);

    this.valueChange.emit(this.toDecimalValue(value));
  }

  @HostListener('keyup', ['$event.target.value'])
  onKeyUp(value: any) {
    if(this.respondingToUserInput && this.respondingToUserInputTimer) {
      clearTimeout(this.respondingToUserInputTimer);
    }
    
    this.respondingToUserInput = true;
    this.respondingToUserInputTimer = setTimeout(() => this.respondingToUserInput = false, 100);

    this.valueChange.emit(this.toDecimalValue(value));
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