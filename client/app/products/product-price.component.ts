import { Component, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { UnitType, unitTypes } from './product';
import { MoneyPipe } from '../shared/pipes';
import { FocusDirective } from '../shared/focus.directive'
import { NumericDirective } from '../shared/number.component';

@Component({
  selector: 'cc-product-price',
  directives: [FocusDirective, NumericDirective],
  pipes: [MoneyPipe],
  template: `
    <div class="product-price editable" cc-focus (focus)="startEdit()" (blur)="endEdit()">
      <input type="checkbox" *ngIf="!editing" style="position: absolute;left:-1000px" cc-focus [tabindex]="editTabindex" />
      <div class="editable-display" *ngIf="!editing" (click)="startEdit()">
        <span [innerHTML]="price | money"></span> <span class="muted">{{ unitTypeName(unitType) }}</span>
      </div>
      <div class="editable-edit" *ngIf="editing">
        &pound;<input type="text" class="input price" #priceElem cc-focus grab="true" [selectAll]="addMode" [(ngModel)]="priceString" [tabindex]="editTabindex" required (ngModelChange)="priceChanged($event)" />
        <select class="input" #unitTypeElem cc-focus [(ngModel)]="unitType" [tabindex]="editTabindex" (ngModelChange)="unitTypeChanged($event)">
          <option *ngFor="let ut of unitTypes" [ngValue]="ut.value">{{ ut.name }}</option>
        </select>
      </div>
    </div>
  `
})
export class ProductPriceComponent {
  unitTypes: UnitType[];
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

  @Input()
  editTabindex: number;

  @Output()
  priceChange = new EventEmitter<number>();

  @Output()
  unitTypeChange = new EventEmitter<string>();

  @Output()
  update = new EventEmitter<any>();

  startEdit() {
    this.editing = true;
    this.priceString = this.toStringValue(this.price);
  }

  endEdit() {
    this.editing = false;
    this.update.emit(null);
  }

  unitTypeName(value: string) {
    return this.unitTypes.find(ut => ut.value == value).name;
  }

  priceChanged(value: string) {
    this.price = this.toDecimalValue(value);
    this.priceChange.emit(this.price);
  }

  unitTypeChanged(value: string) {
    this.unitTypeChange.emit(value);
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