import { Component, Input, ViewChild, ElementRef, Output, EventEmitter, OnInit, AfterViewInit, Renderer } from '@angular/core';
import { ActiveElementDirective, ActivateOnFocusDirective } from './active-elements'
import { ValidatableComponent } from '../shared/validatable.component';
import { EditableValueComponent } from '../shared/editable-value.component'

@Component({
  selector: 'cc-heading',
  directives: [ActiveElementDirective, ActivateOnFocusDirective, ValidatableComponent, EditableValueComponent],
  template: `
    <cc-editable-value #editable className="heading" (start)="onStart()" (ok)="onOk()" (cancel)="onCancel()">
      <display>
        <h3>{{value}}</h3>
        <a class="edit"><i class="icon-edit"></i></a>
      </display>
      <edit>
        <cc-validatable [valid]="valid" message="Heading should not be empty">
          <input type="text" #input [(ngModel)]="editingValue" tabindex="1" (focus)="startEdit()" cc-active cc-activate-on-focus />
        </cc-validatable>
      </edit>
    </cc-editable-value>
  `
}) 
export class HeadingComponent implements OnInit {
  editingValue: string;

  @Input()
  value: string;

  @ViewChild('input')
  input: ElementRef;

  @ViewChild('editable')
  editable: EditableValueComponent

  @Output()
  valueChange = new EventEmitter<string>();

  @Output()
  update = new EventEmitter<string>();

  get valid() {
    return this.editingValue && !!this.editingValue.length;
  }

  constructor(private renderer: Renderer) {
  }

  ngOnInit() {
    this.editingValue = this.value;
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
    this.update.emit(this.value);

    this.editable.endEdit();
  }

  onCancel() {
    this.editingValue = this.value;
    this.editable.endEdit();
  }
}