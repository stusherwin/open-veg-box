import { Component, Input, ViewChild, ElementRef, Output, EventEmitter, OnInit, AfterViewInit, Renderer } from '@angular/core';
import { ActiveElementDirective, ActivateOnFocusDirective } from '../shared/active-elements'
import { EditableValueComponent } from '../shared/editable-value.component'
import { ValidatableComponent } from '../shared/validatable.component';
import { SingleLinePipe, PreserveLinesPipe, DefaultToPipe } from '../shared/pipes'

@Component({
  selector: 'cc-customer-address',
  directives: [ActiveElementDirective, ActivateOnFocusDirective, EditableValueComponent, ValidatableComponent],
  pipes: [SingleLinePipe, PreserveLinesPipe, DefaultToPipe],
  host: {'class': 'customer-detail address'},
  template: `
    <cc-editable-value #editable (start)="onStart()" (ok)="onOk()" (cancel)="onCancel()" [okOnEnter]="false">
      <display>
        <div class="detail-marker"><i class="icon-home"></i></div>
        <div class="detail-display">
          <span [innerHTML]="value | defaultTo:'no address' | singleLine:' '"></span>
          <a class="edit"><i class="icon-edit"></i></a>
        </div>
      </display>
      <edit>
        <div class="detail-marker"><i class="icon-home"></i></div>
        <div class="detail-edit">
          <textarea #textarea [(ngModel)]="editingValue" cc-active cc-activate-on-focus [tabindex]="editTabindex" (focus)="startEdit()"></textarea>
        </div>
      </edit>
    </cc-editable-value>
  `
}) 
export class CustomerAddressComponent implements OnInit {
  editingValue: string;

  @Input()
  value: string;

  @Input()
  editTabindex: number;

  @ViewChild('textarea')
  textarea: ElementRef;

  @ViewChild('editable')
  editable: EditableValueComponent

  @Output()
  valueChange = new EventEmitter<string>();

  @Output()
  update = new EventEmitter<any>();

  constructor(private renderer: Renderer) {
  }

  ngOnInit() {
    this.editingValue = this.value;
  }

  startEdit() {
    this.editable.startEdit();
  }

  onStart() {
    setTimeout(() => this.renderer.invokeElementMethod(this.textarea.nativeElement, 'focus', []))
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