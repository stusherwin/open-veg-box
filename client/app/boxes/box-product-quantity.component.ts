import { Component, Directive, Input, ViewChild, ElementRef, Output, EventEmitter, ViewChildren, QueryList, AfterViewInit, ChangeDetectorRef, AfterViewChecked, OnChanges, Inject, forwardRef, OnInit, OnDestroy, Renderer } from '@angular/core';
import { BoxProduct } from './box'
import { WeightPipe } from '../shared/pipes'
import { Arrays } from '../shared/arrays'
import { ActiveElementDirective, ActivateOnFocusDirective } from '../shared/active-elements';
import { ValidatableComponent } from '../shared/validatable.component';
import { Subscription } from 'rxjs/Subscription'
import { EditableValueComponent } from '../shared/editable-value.component'

@Component({
  selector: 'cc-box-product-quantity',
  directives: [ActiveElementDirective, ActivateOnFocusDirective, ValidatableComponent, EditableValueComponent],
  pipes: [WeightPipe],
  templateUrl: 'app/boxes/box-product-quantity.component.html'
})
export class BoxProductQuantityComponent implements OnInit {
  editingValue: string;
  
  @Input()
  value: number;

  @Input()
  unitType: string;

  @Input()
  width: number;

  @Input()
  editId: string;

  @Input()
  editTabindex: number;

  @ViewChild('input')
  input: ElementRef

  @ViewChild('active')
  active: ActiveElementDirective

  @ViewChild('editable')
  editable: EditableValueComponent

  @Output()
  update = new EventEmitter<number>();
  
  get valid() {
    return this.toDecimalValue(this.editingValue) > 0
  }

  constructor(private renderer: Renderer) {
  }

  ngOnInit() {
    this.editingValue = this.toStringValue(this.value);
  }

  onStart() {
    this.renderer.invokeElementMethod(this.input.nativeElement, 'focus', []);
  }

  onOk() {
    let newValue = this.toDecimalValue(this.editingValue);

    if(newValue != this.value) {
      this.value = newValue;
      this.update.emit(this.value);
    }

    this.editingValue = this.toStringValue(this.value);
    this.editable.endEdit();
  }

  onCancel() {
    this.editingValue = this.toStringValue(this.value);
    this.editable.endEdit();
  }

  onFocus() {
    this.editable.startEdit();
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
      while (result !== '0' && (result.endsWith('.') || (result.indexOf('.') != -1 && result.endsWith('0')))) {
        result = result.substring(0, result.length - 1);
      }
      return result;
    } else {
      return '' + value;
    }
  }
}