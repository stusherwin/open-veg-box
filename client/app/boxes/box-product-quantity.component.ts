import { Component, Directive, Input, ViewChild, ElementRef, Output, EventEmitter, ViewChildren, QueryList, AfterViewInit, ChangeDetectorRef, AfterViewChecked, OnChanges, Inject, forwardRef, OnInit, OnDestroy } from '@angular/core';
import { FocusDirective } from '../shared/focus.directive'
import { BoxProduct } from './box'
import { WeightPipe } from '../shared/pipes'
import { Arrays } from '../shared/arrays'
import { MutuallyExclusiveEditService, MutuallyExclusiveEditComponent } from './mutually-exclusive-edit.service'

@Component({
  selector: 'cc-box-product-quantity',
  directives: [FocusDirective],
  pipes: [WeightPipe],
  templateUrl: 'app/boxes/box-product-quantity.component.html'
})
export class BoxProductQuantityComponent implements MutuallyExclusiveEditComponent {
  editingValue: number;
  editing: boolean;
  
  @Input()
  value: number;

  @Input()
  unitType: string;

  @Input()
  width: number;

  @Output()
  editStart = new EventEmitter<any>();

  @Output()
  editEnd = new EventEmitter<any>();

  @Output()
  update = new EventEmitter<number>();

  constructor(
    @Inject(forwardRef(() => MutuallyExclusiveEditService))
    private mutexService: MutuallyExclusiveEditService) {
  } 

  onEditClick() {
    this.mutexService.startEdit(this);
    this.editing = true;
    this.editingValue = this.value;
    
    this.editStart.emit(null);
  }

  onEditOkClick() {
    this.value = this.editingValue;
    this.cancelEdit();

    this.update.emit(this.value);
    this.editEnd.emit(null);
  }

  onEditCancelClick() {
    this.cancelEdit();
    this.editEnd.emit(null);
  }

  onEditQuantityChange(value: any) {
    this.editingValue = this.toDecimalValue(value);
  }

  cancelEdit() {
    this.editingValue = null;
    this.editing = false;
  }

  onEditFocus() {
    console.log('editFocus');
    if(this.editing) {
      return;
    }

    this.onEditClick();
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
}