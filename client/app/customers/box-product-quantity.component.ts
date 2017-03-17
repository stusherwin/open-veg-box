import { Component, Directive, Input, ViewChild, ElementRef, Output, EventEmitter, ViewChildren, QueryList, AfterViewInit, ChangeDetectorRef, AfterViewChecked, OnChanges, Inject, forwardRef, OnInit, OnDestroy, Renderer } from '@angular/core';
import { WeightPipe } from '../shared/pipes'
import { Arrays } from '../shared/arrays'
import { ActiveElementDirective, ActivateOnFocusDirective } from '../shared/active-elements';
import { ValidatableComponent } from '../shared/validatable.component';
import { Subscription } from 'rxjs/Subscription'
import { EditableValueComponent } from '../shared/editable-value.component'
import { NumericDirective } from '../shared/numeric.directive'

@Component({
  selector: 'cc-box-product-quantity',
  directives: [ActiveElementDirective, ActivateOnFocusDirective, ValidatableComponent, EditableValueComponent, NumericDirective],
  pipes: [WeightPipe],
  templateUrl: 'app/customers/box-product-quantity.component.html'
})
export class BoxProductQuantityComponent implements OnInit {
  editingValue: number;

  @Input()
  editing: boolean;
  
  @Input()
  value: number;

  @Input()
  unitType: string;

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
  valueChange = new EventEmitter<number>();
  
  constructor(private renderer: Renderer) {
  }

  ngOnInit() {
    this.editingValue = this.value;
  }

  onStart() {
    this.editingValue = this.value;
    this.renderer.invokeElementMethod(this.input.nativeElement, 'focus', []);
  }

  onOk() {
    let newValue = this.editingValue;

    if(newValue != this.value) {
      this.value = newValue;
      this.valueChange.emit(this.value);
    }

    this.editable.endEdit();
  }

  onCancel() {
    this.editable.endEdit();
  }

  onFocus() {
    this.editable.startEdit();
  }
}