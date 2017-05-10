import { Component, Directive, Input, ViewChild, ElementRef, Output, EventEmitter, ViewChildren, QueryList, AfterViewInit, ChangeDetectorRef, AfterViewChecked, OnChanges, Inject, forwardRef, OnInit, OnDestroy, Renderer } from '@angular/core';
import { ProductQuantity } from '../products/product'
import { WeightPipe } from '../shared/pipes'
import { Arrays } from '../shared/arrays'
import { ValidatableComponent } from '../shared/validatable.component';
import { Subscription } from 'rxjs/Subscription'
import { EditableValueComponent } from '../shared/editable-value.component'
import { NumericDirective } from '../shared/numeric.directive'
import { ProductQuantityComponent } from '../products/product-quantity.component'

@Component({
  selector: 'cc-box-product-quantity',
  directives: [ValidatableComponent, EditableValueComponent, NumericDirective, ProductQuantityComponent],
  pipes: [WeightPipe],
  templateUrl: 'app/boxes/box-product-quantity.component.html'
})
export class BoxProductQuantityComponent implements OnInit {
  editingValue: number;
  
  @Input()
  value: number;

  @Input()
  unitType: string;

  @Input()
  editId: string;

  @ViewChild('input')
  input: ElementRef

  @ViewChild('editable')
  editable: EditableValueComponent

  @Output()
  update = new EventEmitter<number>();
  
  constructor(private renderer: Renderer) {
  }

  ngOnInit() {
    this.editingValue = this.value;
  }

  onStart() {
    this.renderer.invokeElementMethod(this.input.nativeElement, 'focus', []);
  }

  onOk() {
    let newValue = this.editingValue;

    if(newValue != this.value) {
      this.value = newValue;
      this.update.emit(this.value);
    }

    this.editingValue = this.value;
    this.editable.endEdit();
  }

  onCancel() {
    this.editingValue = this.value;
    this.editable.endEdit();
  }

  onFocus() {
    this.editable.startEdit();
  }
}