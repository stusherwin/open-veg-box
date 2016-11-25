import { Component, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { UnitType, unitTypes } from './product';
import { WeightPipe } from '../shared/pipes';
import { FocusDirective } from '../shared/focus.directive'

@Component({
  selector: 'cc-product-unit-quantity',
  directives: [FocusDirective],
  pipes: [WeightPipe],
  template: `
    <div class="product-unit-quantity editable" cc-focus (ccFocus)="startEdit()" (ccBlur)="endEdit()">
      <input type="checkbox" *ngIf="!editing" style="position: absolute;left:-1000px" [tabindex]="editTabindex" cc-focus />
      <div class="editable-display" *ngIf="!editing" (click)="startEdit()">
        <span class="muted">sold in units of</span> {{ unitQuantity | weight }}
      </div>
      <div class="editable-edit" *ngIf="editing">
        <span class="muted">sold in units of</span>
        <input type="text" class="input tiny" #unitQuantityElem cc-focus grab="true" [(ngModel)]="unitQuantityString" [tabindex]="editTabindex" required (ngModelChange)="unitQuantityChanged($event)" />
        Kg
      </div>
    </div>
  `
})
export class ProductUnitQuantityComponent {
  fixedDecimals: number = null;
  maxDecimals: number = 3;
  unitQuantityString: string;
  
  @ViewChild('unitQuantityElem')
  unitQuantityElem: ElementRef;

  @Input()
  unitQuantity: number;

  @Input()
  editing: boolean;

  @Input()
  addMode: boolean;

  @Input()
  editTabindex: number;

  @Output()
  unitQuantityChange = new EventEmitter<number>();

  @Output()
  update = new EventEmitter<any>();
  
  startEdit() {
    this.editing = true;
    this.unitQuantityString = this.toStringValue(this.unitQuantity);
  }

  endEdit() {
    this.editing = false;
    this.update.emit(null);
  }

  unitQuantityChanged(value: string) {
    this.unitQuantity = this.toDecimalValue(this.unitQuantityString);
    this.unitQuantityChange.emit(this.unitQuantity);
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