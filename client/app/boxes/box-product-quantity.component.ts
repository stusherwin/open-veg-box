import { Component, Directive, Input, ViewChild, ElementRef, Output, EventEmitter, ViewChildren, QueryList, AfterViewInit, ChangeDetectorRef, AfterViewChecked, OnChanges, Inject, forwardRef, OnInit, OnDestroy } from '@angular/core';
import { FocusDirective } from '../shared/focus.directive'
import { BoxProduct } from './box'
import { WeightPipe } from '../shared/pipes'
import { Arrays } from '../shared/arrays'
import { MutuallyExclusiveEditService, MutuallyExclusiveEditComponent } from './mutually-exclusive-edit.service'
import { Subscription } from 'rxjs/Subscription'

@Component({
  selector: 'cc-box-product-quantity',
  directives: [FocusDirective],
  pipes: [WeightPipe],
  templateUrl: 'app/boxes/box-product-quantity.component.html'
})
export class BoxProductQuantityComponent implements MutuallyExclusiveEditComponent, OnInit, AfterViewInit {
  stringValue: string;
  editing: boolean;
  
  @Input()
  value: number;

  @Input()
  unitType: string;

  @Input()
  width: number;

  @Input()
  editId: string;

  @ViewChildren('focusable')
  focusables: QueryList<FocusDirective>;

  @Output()
  update = new EventEmitter<number>();

  constructor(
    @Inject(forwardRef(() => MutuallyExclusiveEditService))
    private mutexService: MutuallyExclusiveEditService) {
  }

  ngOnInit() {
    if(this.mutexService.isAnyEditingWithPrefix(this.editId)) {
      this.mutexService.startEdit(this);
      this.editing = true;
    }

    this.stringValue = this.toStringValue(this.value);
  }

  ngAfterViewInit() {
    if(this.focusables.length && this.editing) {
      this.focusables.first.beFocused();
    }
  }

  onEditClick() {
    this.mutexService.startEdit(this);
    this.editing = true;

    let subscription = this.focusables.changes.subscribe((f: QueryList<FocusDirective>) => {
      if(f.length && this.editing) {
        f.first.beFocused();
        subscription.unsubscribe();
      }
    })
  }

  onEditOkClick() {
    let newValue = this.toDecimalValue(this.stringValue);

    if(newValue != this.value && newValue > 0) {
      this.value = newValue;
      this.update.emit(this.value);
    }

    this.stringValue = this.toStringValue(this.value);
    this.editing = false;
    this.mutexService.endEdit(this);
  }

  onEditCancelClick() {
    this.stringValue = this.toStringValue(this.value);
    this.editing = false;
    this.mutexService.endEdit(this);
  }

  endEdit() {
    console.log('edit quantity ' + this.value +' endEdit');
    //this.onEditOkClick();
  }

  onEditFocus() {
    if(this.editing) {
      return;
    }

    this.onEditClick();
  }

  onFocus() {
    //console.log('edit quantity ' + this.value +' focus');
  }

  onBlur() {
 //   console.log('edit quantity ' + this.value +' blur');
    this.onEditOkClick();
  }

  onStringValueFocus() {
   // console.log('stringValue focus');
  }

  onStringValueBlur() {
    //console.log('stringValue blur');
  }

  keydown(event: KeyboardEvent) {
    if(!this.editing) {
      return;
    }

    if(event.key == 'Enter') {
      this.onEditOkClick();
    } else if(event.key == 'Escape') {
      this.onEditCancelClick();
    }
  }

  fixedDecimals: number = null;
  maxDecimals: number = 3;
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
}