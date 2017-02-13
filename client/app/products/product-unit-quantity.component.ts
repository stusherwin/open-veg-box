import { Component, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { UnitType, unitTypes } from './product';
import { WeightPipe } from '../shared/pipes';
import { FocusDirective } from '../shared/focus.directive'
import { EditableComponent } from '../shared/editable.component'

@Component({
  selector: 'cc-product-unit-quantity',
  directives: [FocusDirective, EditableComponent],
  pipes: [WeightPipe],
  template: `
    <cc-editable className="product-unit-quantity" [tabindex]="editTabindex" (editStart)="onEditStart($event)" (editEnd)="onEditEnd($event)">
      <div display>
        <span class="muted">sold in units of</span> {{ unitQuantity | weight }}
      </div>
      <div edit>
        <span class="muted">sold in units of</span>
        <input type="text" class="input tiny" #unitQuantityElem=cc-focus cc-focus [(ngModel)]="unitQuantityString" [tabindex]="editTabindex" required (ngModelChange)="unitQuantityChanged($event)" />
        Kg
      </div>
    </cc-editable>
  `
})
export class ProductUnitQuantityComponent {
  fixedDecimals: number = null;
  maxDecimals: number = 3;
  unitQuantityString: string;
  
  @ViewChild('unitQuantityElem')
  unitQuantityElem: FocusDirective;

  @Input()
  unitQuantity: number;

  @Input()
  addMode: boolean;

  @Input()
  editTabindex: number;

  @Output()
  unitQuantityChange = new EventEmitter<number>();

  @Output()
  update = new EventEmitter<any>();

  onEditStart(tabbedInto: boolean) {
    this.unitQuantityString = this.toStringValue(this.unitQuantity);
    this.unitQuantityElem.beFocused();
  }

  onEditEnd(success: boolean) {
    if(success) {
      this.update.emit(null);
    }
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