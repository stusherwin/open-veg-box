import { Component, Directive, Input, ViewChild, ElementRef, Output, EventEmitter, ViewChildren, QueryList, AfterViewInit, ChangeDetectorRef, AfterViewChecked, OnChanges, Inject, forwardRef, OnInit, OnDestroy, Renderer } from '@angular/core';
import { WeightPipe } from '../../shared/pipes'
import { Arrays } from '../../shared/arrays'
import { ValidatableComponent } from '../../shared/validatable.component';
import { Subscription } from 'rxjs/Subscription'
import { EditableValueComponent } from '../../shared/editable-value-new.component'
import { NumericDirective } from '../../shared/numeric.directive'
import { ProductQuantityComponent } from '../../products/product-quantity.component'
import { ButtonComponent } from '../../shared/button.component'

@Component({
  selector: 'cc-order-item-quantity',
  directives: [ValidatableComponent, EditableValueComponent, NumericDirective, ProductQuantityComponent, ButtonComponent],
  pipes: [WeightPipe],
  templateUrl: 'app/customers/orders/order-item-quantity.component.html'
})
export class OrderItemQuantityComponent {
  @Input()
  editing: boolean;
  
  @Input()
  value: number;

  @Input()
  unitType: string;

  @Input()
  editId: string;

  @ViewChild('input')
  input: ElementRef

  @ViewChild('editable')
  editable: EditableValueComponent<number>

  @Output()
  valueChange = new EventEmitter<number>();

  @Output()
  editingValueChange = new EventEmitter<number>();
  
  constructor(private renderer: Renderer) {
  }

  onStart() {
    this.renderer.invokeElementMethod(this.input.nativeElement, 'focus', []);
  }

  onEditingValueChange(quantity: number) {
    if(this.editable.editing) {
      this.editingValueChange.emit(quantity);
    }
  }
}