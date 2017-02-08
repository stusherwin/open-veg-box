import { Component, Input, ViewChild, ElementRef, Output, EventEmitter, OnInit, AfterViewInit, Renderer } from '@angular/core';
import { FocusDirective } from '../shared/focus.directive'
import { MoneyPipe } from '../shared/pipes';

@Component({
  selector: 'cc-box-price',
  directives: [FocusDirective],
  pipes: [MoneyPipe],
  template: `
    <div class="product-price-new" (keydown)="onKeyDown($event)" #container=cc-focus cc-focus (blur)="onContainerBlur()">
      <div class="product-price-display" *ngIf="!editing" (click)="onClick()"><span class [innerHTML]="value | money"></span><a><i class="icon-edit"></i></a></div>
      <input type="text" style="position: absolute;left:-10000px" *ngIf="!editing" [tabindex]="editTabindex" (focus)="onFocus()" />
      <div class="product-price-edit" *ngIf="editing">
        <span class="edit-wrapper" [class.invalid]="!valid">
          &pound; <span class="input-wrapper"><input type="text" #input class="input price" [class.invalid]="!valid" data-validation-message="Price should be a number greater than 0" [(ngModel)]="editingValue" (ngModelChange)="validate()" [tabindex]="editTabindex" />
          <i *ngIf="!valid" class="icon-warning" title="Price should be a number greater than 0"></i></span><a (click)="onOkClick()"><i class="icon-ok"></i></a><a (click)="onCancelClick()"><i class="icon-cancel"></i></a>
        </span>
      </div>
    </div>
  `
}) 
// TODO: active based on focus/blur of child components
export class BoxPriceComponent implements OnInit, AfterViewInit {
  originalValue: number;
  editingValue: string;
  editing = false;
  valid = true;

  @Input()
  value: number;

  @Input()
  editTabindex: number;

  @Input()
  addMode: boolean;

  @ViewChild('container')
  container: FocusDirective;

  @ViewChild('input')
  input: ElementRef;

  @Output()
  valueChange = new EventEmitter<number>();

  @Output()
  update = new EventEmitter<any>();

  constructor(private renderer: Renderer) {
  }

  ngOnInit() {
    this.originalValue = this.value;
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
    let selectAll = this.addMode && this.toDecimalValue(this.editingValue) == this.originalValue; 
    
    setTimeout(() => {
      let elem = this.input.nativeElement;
      this.renderer.invokeElementMethod(elem, 'focus', []);

      let selectionStart = selectAll? 0 : elem.value.length;
      this.renderer.invokeElementMethod(elem, 'setSelectionRange', [selectionStart, elem.value.length]);
    })

    this.container.beFocused();
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
  }

  onCancelClick() {
    this.editing = false;
    this.tabbedAway = false;
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
    } else if(event.key == 'Tab' && !event.shiftKey) {
      this.tabbedAway = true;
    }
  }

  onContainerBlur() {
    if(this.tabbedAway && this.valid) {
      this.onOkClick();
    } else {
      this.onCancelClick();
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