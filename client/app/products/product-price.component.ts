import { Component, Input, ViewChild, ElementRef, Output, EventEmitter, OnInit, Renderer } from '@angular/core';
import { UnitType, unitTypes } from './product';
import { MoneyPipe } from '../shared/pipes';
import { ActiveElementDirective, ActivateOnFocusDirective } from '../shared/active-elements'
import { EditableValueComponent } from '../shared/editable-value.component'
import { ValidatableComponent } from '../shared/validatable.component'
import { NumericDirective } from '../shared/numeric.directive'

@Component({
  selector: 'cc-product-price',
  directives: [EditableValueComponent, ActiveElementDirective, ActivateOnFocusDirective, ValidatableComponent, NumericDirective],
  pipes: [MoneyPipe],
  template: `
    <cc-editable-value #editable className="product-price" [valid]="valid" (start)="onStart()" (ok)="onOk()" (cancel)="onCancel()">
      <display>
        <span [innerHTML]="price | money"></span> <span class="muted">{{ unitTypeName(unitType) }}</span>
        <a class="edit" tabindex="9999"><i class="icon-edit"></i></a>
      </display>
      <edit>
        &pound;
        <cc-validatable [valid]="valid" message="Price should be a number greater than 0">
          <input type="text" #input cc-numeric fixedDecimals="2" [(value)]="editingPrice" [tabindex]="editTabindex" (focus)="startEdit()" cc-active cc-activate-on-focus />
        </cc-validatable>
        <select class="input" cc-active cc-activate-on-focus (focus)="startEdit()" [(ngModel)]="unitType" [tabindex]="editTabindex" (ngModelChange)="unitTypeChanged($event)">
          <option *ngFor="let ut of unitTypes" [ngValue]="ut.value">{{ ut.name }}</option>
        </select>
      </edit>
    </cc-editable-value>
  `
})
export class ProductPriceComponent implements OnInit {
  editingPrice: number;
  unitTypes: UnitType[];
  fixedDecimals: number = 2;
  maxDecimals: number = null;
  
  @Input()
  price: number;

  @Input()
  unitType: string;

  @Input()
  editTabindex: number;

  @ViewChild('input')
  input: ElementRef;

  @ViewChild('editable')
  editable: EditableValueComponent

  @Output()
  priceChange = new EventEmitter<number>();

  @Output()
  unitTypeChange = new EventEmitter<string>();

  @Output()
  update = new EventEmitter<any>();

  get valid() {
    return this.editingPrice > 0;
  }

  constructor(private renderer: Renderer) {
    this.unitTypes = unitTypes;
  }

  ngOnInit() {
    this.editingPrice = this.price;
  }

  startEdit() {
    this.editable.startEdit();
  }

  onStart() {
    setTimeout(() => this.renderer.invokeElementMethod(this.input.nativeElement, 'focus', []))
  }

  onOk() {
    this.price = this.editingPrice;
    
    //TODO: just one event!
    this.priceChange.emit(this.price);
    this.update.emit(null);
    this.editable.endEdit();
  }

  onCancel() {
    this.editingPrice = this.price;
    this.editable.endEdit();
  }

  unitTypeName(value: string) {
    return this.unitTypes.find(ut => ut.value == value).name;
  }

  unitTypeChanged(value: string) {
    this.unitTypeChange.emit(value);
  }
}