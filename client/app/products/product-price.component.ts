import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { UnitType, unitTypes } from './product';
import { MoneyPipe } from '../shared/pipes';
import { FocusDirective } from '../shared/focus.directive'
import { NumericDirective } from '../shared/number.component';

@Component({
  selector: 'cc-product-price',
  directives: [FocusDirective, NumericDirective],
  pipes: [MoneyPipe],
  template: `
    <div class="product-price editable">
      <input type="checkbox" *ngIf="!editing" style="position: absolute;left:-1000px" (focus)="startEdit()" />
      <div class="editable-display" *ngIf="!editing" (click)="startEdit()">
        <span [innerHTML]="price | money"></span> <span class="muted">{{ unitTypeName(unitType) }}</span>
      </div>
      <div class="editable-edit" *ngIf="editing">
        &pound;<input type="text" class="input price" #priceElem cc-focus grab="true" highlight="true" (focus)="focus()" (blur)="blur()" [(ngModel)]="priceString" tabindex="0" required (ngModelChange)="priceChanged()" />
        <select class="input" #unitTypeElem cc-focus highlight="true" [(ngModel)]="unitType" tabindex="0" (focus)="focus()" (blur)="blur()">
          <option *ngFor="let ut of unitTypes" [ngValue]="ut.value">{{ ut.name }}</option>
        </select>
      </div>
    </div>
  `
})
export class ProductPriceComponent {
  unitTypes: UnitType[];
  cancelled: boolean;
  fixedDecimals: number = 2;
  maxDecimals: number = null;
  priceString: string;
  
  constructor() {
    this.unitTypes = unitTypes;
  }

  @ViewChild('priceElem')
  priceElem: ElementRef;

  @ViewChild('unitTypeElem')
  unitTypeElem: ElementRef;

  @Input()
  price: number;

  @Input()
  unitType: string;

  @Input()
  editing: boolean;

  @Input()
  addMode: boolean;

  startEdit() {
    this.editing = true;
    this.priceString = this.toStringValue(this.price);
  }

  endEdit() {
    this.editing = false;
  }

  blur() {
    this.cancelled = false;
    setTimeout(() => {
      if(!this.cancelled) {
        this.endEdit();
        this.cancelled = false;
      }
    }, 100);
  }

  focus() {
    this.cancelled = true;
  }

  unitTypeName(value: string) {
    return this.unitTypes.find(ut => ut.value == value).name;
  }

  priceChanged() {
    this.price = this.toDecimalValue(this.priceString);
  }

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

