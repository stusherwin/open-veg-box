import { Component, Input, ViewChild, ElementRef, Output, EventEmitter, OnInit, AfterViewInit, Renderer } from '@angular/core';
import { MoneyPipe } from '../shared/pipes';
import { ActiveElementDirective, ActivateOnFocusDirective } from '../shared/active-elements'
import { EditableValueComponent } from '../shared/editable-value.component'
import { ValidatableComponent } from '../shared/validatable.component';

@Component({
  selector: 'cc-box-price',
  directives: [ActiveElementDirective, ActivateOnFocusDirective, EditableValueComponent, ValidatableComponent],
  pipes: [MoneyPipe],
  template: `
    <cc-editable-value #editable className="x-product-price" [valid]="valid" (start)="onStart()" (ok)="onOk()" (cancel)="onCancel()">
      <display>
        <span class [innerHTML]="value | money"></span>
        <a class="edit"><i class="icon-edit"></i></a>
      </display>
      <edit>
        &pound;
        <cc-validatable [valid]="valid" message="Price should be a number greater than 0">
          <input type="text" #input class="input price" [(ngModel)]="editingValue" [tabindex]="editTabindex" (focus)="startEdit()" cc-active cc-activate-on-focus />
        </cc-validatable>
      </edit>
    </cc-editable-value>
  `
}) 
export class BoxPriceComponent implements OnInit, AfterViewInit {
  editingValue: string;

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

  get valid() {
    return this.toDecimalValue(this.editingValue) > 0;
  }

  constructor(private renderer: Renderer) {
  }

  ngOnInit() {
    this.editingValue = this.toStringValue(this.value);
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
    this.value = this.toDecimalValue(this.editingValue);
    
    //TODO: just one event!
    this.valueChange.emit(this.value);
    this.update.emit(null);
    
    this.editingValue = this.toStringValue(this.value);
    this.editable.endEdit();
  }

  onCancel() {
    this.editingValue = this.toStringValue(this.value);
    this.editable.endEdit();
  }

  fixedDecimals: number = 2;
  maxDecimals: number = null;
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