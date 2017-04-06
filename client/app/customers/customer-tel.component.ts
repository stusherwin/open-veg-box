import { Component, Directive, Input, ViewChild, ElementRef, Output, EventEmitter, Renderer, OnInit } from '@angular/core';
import { ActiveElementDirective, ActivateOnFocusDirective } from '../shared/active-elements'
import { EditableValueComponent } from '../shared/editable-value.component'
import { ValidatableComponent } from '../shared/validatable.component';
import { DefaultToPipe } from '../shared/pipes'

@Component({
  selector: 'cc-customer-tel',
  directives: [EditableValueComponent, ActiveElementDirective, ActivateOnFocusDirective, ValidatableComponent],
  pipes: [DefaultToPipe],
  host: {'class': 'customer-detail tel'},
  template: `
    <cc-editable-value #editable (start)="onStart()" (ok)="onOk()" (cancel)="onCancel()">
      <display>
        <div class="detail-marker"><i class="icon-phone"></i></div>
        <div class="detail-display">
          {{ value | defaultTo:'no phone' }}
          <a class="edit"><i class="icon-edit"></i></a>
        </div>
      </display>
      <edit>
        <div class="detail-marker"><i class="icon-phone"></i></div>
        <div class="detail-edit">
          <input type="text" #input [(ngModel)]="editingValue" cc-active cc-activate-on-focus tabindex="1" (focus)="startEdit()" />
        </div>
      </edit>
    </cc-editable-value>
  `
})
export class CustomerTelComponent implements OnInit {
  editingValue: string;

  @ViewChild('input')
  input: ElementRef;

  @ViewChild('editable')
  editable: EditableValueComponent

  @Input()
  value: string;

  @Output()
  valueChange = new EventEmitter<string>();

  @Output()
  update = new EventEmitter<string>();

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