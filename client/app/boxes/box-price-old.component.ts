import { Component, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { MoneyPipe } from '../shared/pipes';
import { FocusDirective } from '../shared/focus.directive'
import { EditableComponent } from '../shared/editable.component'

@Component({
  selector: 'cc-box-price',
  directives: [FocusDirective, EditableComponent],
  pipes: [MoneyPipe],
  template: `
    <cc-editable className="product-price" [tabindex]="editTabindex" (editStart)="onEditStart($event)" (editEnd)="onEditEnd($event)">
      <div display>
        <span [innerHTML]="price | money"></span>
      </div>
      <div edit>
        &pound;<input type="text" class="input price" #priceElem=cc-focus cc-focus [selectAll]="addMode" [(ngModel)]="priceString" [tabindex]="editTabindex" required (ngModelChange)="priceChanged($event)" />
      </div>
    </cc-editable>
  `
})
export class BoxPriceComponent {
  fixedDecimals: number = 2;
  maxDecimals: number = null;
  priceString: string;
  
  constructor() {
  }

  @ViewChild('priceElem')
  priceElem: FocusDirective;

  @Input()
  price: number;

  @Input()
  addMode: boolean;

  @Input()
  editTabindex: number;

  @Output()
  priceChange = new EventEmitter<number>();

  @Output()
  update = new EventEmitter<any>();

  onEditStart(tabbedInto: boolean) {
    this.priceString = this.toStringValue(this.price);
    this.priceElem.beFocused();
  }

  onEditEnd(success: boolean) {
    if(success) {
      this.update.emit(null);
    }
  }

  priceChanged(value: string) {
    this.price = this.toDecimalValue(value);
    this.priceChange.emit(this.price);
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