import { Component, Input, ViewChild, ElementRef, Output, EventEmitter, OnInit, AfterViewInit, Renderer } from '@angular/core';
import { MoneyPipe } from '../shared/pipes';
import { ActiveElementDirective, ActivateOnFocusDirective } from '../shared/active-elements'

@Component({
  selector: 'cc-box-price',
  directives: [ActiveElementDirective, ActivateOnFocusDirective],
  pipes: [MoneyPipe],
  template: `
    <div class="x-product-price editable-value" [class.editing]="editing" (keydown)="onKeyDown($event)" #active=cc-active cc-active (deactivate)="onDeactivate()">
      <div class="editable-value-display" (click)="onClick()">
        <span class [innerHTML]="value | money"></span>
        <a><i class="icon-edit"></i></a>
      </div>
      <div class="editable-value-outer">
        <div class="editable-value-edit" [class.invalid]="!valid">
          &pound; <span class="input-wrapper" [class.invalid]="!valid"><input type="text" #input class="input price" data-validation-message="Price should be a number greater than 0" [(ngModel)]="editingValue" (ngModelChange)="validate()" [tabindex]="editTabindex" (focus)="onFocus()" cc-active cc-activate-on-focus />
          <i *ngIf="!valid" class="icon-warning" title="Price should be a number greater than 0"></i></span>
          <a (click)="onOkClick()"><i class="icon-ok"></i></a>
          <a (click)="onCancelClick()"><i class="icon-cancel"></i></a>
        </div>
      </div>
    </div>
  `
}) 
// TODO: active based on focus/blur of child components
export class BoxPriceComponent implements OnInit, AfterViewInit {
  editingValue: string;
  editing = false;
  valid = true;

  @Input()
  value: number;

  @Input()
  editTabindex: number;

  @Input()
  addMode: boolean;

  @ViewChild('input')
  input: ElementRef;

  @ViewChild('active')
  active: ActiveElementDirective;

  @Output()
  valueChange = new EventEmitter<number>();

  @Output()
  update = new EventEmitter<any>();

  constructor(private renderer: Renderer) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
  }

  startEdit() {
    this.onClick();
  }

  onFocus() {
    if(this.editing) {
      return;
    }

    this.onClick();
  }

  onClick() {
    this.editingValue = this.toStringValue(this.value);
    this.editing = true;
    this.valid = true;
    
    setTimeout(() => this.renderer.invokeElementMethod(this.input.nativeElement, 'focus', []))
  }

  onOkClick() {
    if(!this.valid) {
      return;
    }

    this.value = this.toDecimalValue(this.editingValue);
    
    //TODO: just one event!
    this.valueChange.emit(this.value);
    this.update.emit(null);
    
    this.editing = false;
    this.tabbedAway = false;
    this.active.makeInactive()
  }

  onCancelClick() {
    this.editing = false;
    this.tabbedAway = false;
    this.active.makeInactive()
  }

  tabbedAway = false;
  onKeyDown(event: KeyboardEvent) {
    if(!this.editing) {
      return;
    }

    if(event.key == 'Enter' && this.valid) {
      this.onOkClick();
    } else if(event.key == 'Escape') {
      this.onCancelClick();
    } else if(event.key == 'Tab') {
      this.tabbedAway = !event.shiftKey;
    }
  }

  onDeactivate() {
    if(this.editing) {
      if(this.tabbedAway && this.valid) {
        this.onOkClick();
      } else {
        this.onCancelClick();
      }
    }
  }

  validate() {
    this.valid = this.toDecimalValue(this.editingValue) > 0;
  }

  fixedDecimals: number = 2;
  maxDecimals: number = null;
  private toStringValue(value: number): string {
    if(this.fixedDecimals) {
      return value.toFixed(this.fixedDecimals);
    } else if(this.maxDecimals) {
      var result = value.toFixed(this.maxDecimals);
      while (result !== '0' && (result.endsWith('.') || result.endsWith('0'))) {
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