import { Component, Directive, Input, ViewChild, ElementRef, Output, EventEmitter, ViewChildren, QueryList, AfterViewInit, ChangeDetectorRef, AfterViewChecked, OnChanges, Inject, forwardRef, OnInit, OnDestroy, Renderer } from '@angular/core';
import { WeightPipe } from '../shared/pipes'
import { Arrays } from '../shared/arrays'
import { ActiveElementDirective, ActivateOnFocusDirective } from '../shared/active-elements';
import { ValidatableComponent } from '../shared/validatable.component';
import { Subscription } from 'rxjs/Subscription'
import { EditableValueComponent } from '../shared/editable-value-new.component'
import { NumericDirective } from '../shared/numeric.directive'

@Component({
  selector: 'cc-box-product-quantity',
  directives: [ActiveElementDirective, ActivateOnFocusDirective, ValidatableComponent, EditableValueComponent, NumericDirective],
  pipes: [WeightPipe],
  templateUrl: 'app/customers/box-product-quantity.component.html'
})
export class BoxProductQuantityComponent {
  @Input()
  editing: boolean;
  
  @Input()
  value: number;

  @Input()
  unitType: string;

  @Input()
  editId: string;

  @Input()
  tabindex: number;

  @ViewChild('input')
  input: ElementRef

  @Output()
  valueChange = new EventEmitter<number>();
  
  constructor(private renderer: Renderer) {
  }

  onStart() {
    this.renderer.invokeElementMethod(this.input.nativeElement, 'focus', []);
  }
}