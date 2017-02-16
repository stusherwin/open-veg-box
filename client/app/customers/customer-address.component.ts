import { Component, Input, ViewChild, ElementRef, Output, EventEmitter, OnInit, AfterViewInit, Renderer } from '@angular/core';
import { ActiveElementDirective, ActivateOnFocusDirective } from '../shared/active-elements'
import { EditableValueComponent } from '../shared/editable-value.component'
import { ValidatableComponent } from '../shared/validatable.component';
import { SingleLinePipe, PreserveLinesPipe } from '../shared/pipes'

@Component({
  selector: 'cc-customer-address',
  directives: [ActiveElementDirective, ActivateOnFocusDirective, EditableValueComponent, ValidatableComponent],
  pipes: [SingleLinePipe, PreserveLinesPipe],
  host: {'class': 'x-customer-detail x-address'},
  template: `
    <cc-editable-value #editable [addMode]="addMode" (start)="onStart()" (ok)="onOk()" (cancel)="onCancel()" [okOnEnter]="false">
      <display>
        <div class="detail-marker"><i class="icon-home"></i></div>
        <div class="detail-display">
          <span [innerHTML]="value | singleline:' '"></span>
          <a class="edit"><i class="icon-edit"></i></a>
        </div>
      </display>
      <edit>
        <div class="detail-marker"><i class="icon-home"></i></div>
        <div class="detail-edit">
          <cc-validatable [valid]="valid" message="Address should not be empty">
            <textarea #textarea [(ngModel)]="editingValue" cc-active cc-activate-on-focus [tabindex]="editTabindex" (focus)="startEdit()"></textarea>
          </cc-validatable>
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

  @Input()
  addMode: boolean;

  @ViewChild('textarea')
  textarea: ElementRef;

  @ViewChild('editable')
  editable: EditableValueComponent

  @Output()
  valueChange = new EventEmitter<string>();

  @Output()
  update = new EventEmitter<any>();

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
    setTimeout(() => this.renderer.invokeElementMethod(this.textarea.nativeElement, 'focus', []))
  }

  onOk() {
    this.value = this.editingValue;
    console.log(this.value)

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