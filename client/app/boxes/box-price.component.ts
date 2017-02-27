import { Component, Input, ViewChild, ElementRef, Output, EventEmitter, OnInit, AfterViewInit, Renderer } from '@angular/core';
import { MoneyPipe } from '../shared/pipes';
import { ActiveElementDirective, ActivateOnFocusDirective } from '../shared/active-elements'
import { EditableValueComponent } from '../shared/editable-value.component'
import { ValidatableComponent } from '../shared/validatable.component';
import { NumericDirective } from '../shared/numeric.directive'

@Component({
  selector: 'cc-box-price',
  directives: [ActiveElementDirective, ActivateOnFocusDirective, EditableValueComponent, ValidatableComponent, NumericDirective],
  pipes: [MoneyPipe],
  template: `
    <cc-editable-value #editable className="box-price" (start)="onStart()" (ok)="onOk()" (cancel)="onCancel()">
      <display>
        <span class [innerHTML]="value | money"></span>
        <a class="edit"><i class="icon-edit"></i></a>
      </display>
      <edit>
        &pound;
        <cc-validatable [valid]="editingValue > 0" message="Price should be a number greater than 0">
          <input type="text" #input class="input price" cc-numeric fixedDecimals="2" [(value)]="editingValue" [tabindex]="editTabindex" (focus)="startEdit()" cc-active cc-activate-on-focus />
        </cc-validatable>
      </edit>
    </cc-editable-value>
  `
}) 
export class BoxPriceComponent implements OnInit, AfterViewInit {
  editingValue: number;

  @Input()
  value: number;

  @Input()
  editTabindex: number;

  @ViewChild('input')
  input: ElementRef;

  @ViewChild('active')
  active: ActiveElementDirective;

  @ViewChild('editable')
  editable: EditableValueComponent

  @Output()
  valueChange = new EventEmitter<number>();

  @Output()
  update = new EventEmitter<any>();

  constructor(private renderer: Renderer) {
  }

  ngOnInit() {
    this.editingValue = this.value;
  }

  ngAfterViewInit() {
  }

  startEdit() {
    this.editable.startEdit();
  }

  onStart() {
    setTimeout(() => this.renderer.invokeElementMethod(this.input.nativeElement, 'focus', []))
  }

  onOk() {
    this.value = this.editingValue;
    
    //TODO: just one event!
    this.valueChange.emit(this.value);
    this.update.emit(null);
    this.editable.endEdit();
  }

  onCancel() {
    this.editingValue = this.value;
    this.editable.endEdit();
  }
}