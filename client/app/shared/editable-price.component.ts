import { Component, OnInit, Input, Output, Inject, forwardRef, ViewChildren, QueryList, EventEmitter, ViewChild, ElementRef, Renderer, ChangeDetectorRef, HostListener } from '@angular/core';
import { Control, Validators, FORM_DIRECTIVES, FormBuilder, ControlGroup } from '@angular/common'
import { NumberComponent } from './number.component'
import { EditableEditButtonComponent } from './editable-edit-button.component'
import { EditableButtonsComponent } from './editable-buttons.component'
import { EditableService } from './editable.service'
import { MoneyPipe } from './pipes'

@Component({
  selector: 'cc-editable-price',
  template: `
    <div class="editable editable-price" [class.editable-display-clickable]="!editing" [class.hover]="focused" (click)="startEdit()">
      <span class="editable-display" [style.visibility]="editing? 'hidden' : 'visible'">
        <span class="editable-display-value" [innerHTML]="value | money"></span>
        <cc-editable-button #edit [key]="key" icon="edit" *ngIf="!editing" (click)="startEdit()" (focus)="focused = true" (blur)="focused = false"></cc-editable-button>
      </span>
      <form class="editable-background" [class.submitted]="submitted" [class.invalid]="submitted && !control.valid" *ngIf="editing">
        &pound;<cc-number #number
                 [(value)]="editingValue"
                 (valueChange)="setValidationMessage()"
                 [fixedDecimals]="true"
                 [decimalPrecision]="2"
                 [control]="control"
                 [messages]="messages">
        </cc-number>
        <span class="validation-warning"
              *ngIf="submitted && !control.valid"
              [title]="validationMessage">
          <i class="icon-warning"></i>
        </span>
        <cc-editable-buttons [invalid]="submitted && !control.valid"
                             (ok)="ok()"
                             (cancel)="cancel()">
        </cc-editable-buttons>
      </form>
    </div>
  `,
  directives: [EditableEditButtonComponent, NumberComponent, EditableButtonsComponent],
  pipes: [MoneyPipe]
})
export class EditablePriceComponent implements OnInit {
  editing: boolean;
  editingValue: number;
  control: Control;
  form: ControlGroup;
  submitted = false;
  focused = false;
  wasFocused = false;
  validationMessage: string;

  @Input()
  key: string

  @Input()
  value: number

  @Input()
  validators: any[]

  @Input()
  messages: any

  @Output()
  valueChange = new EventEmitter<number>()

  @ViewChildren('number')
  number: QueryList<NumberComponent>

  @ViewChildren('edit')
  edit: QueryList<EditableEditButtonComponent>

  constructor(private builder: FormBuilder,
    @Inject(forwardRef(() => EditableService))
    private service: EditableService) {
  }

  ngOnInit() {
    this.control = new Control('', Validators.compose([NumberComponent.isNumeric, NumberComponent.isGreaterThanZero, ...this.validators]))
    this.form = this.builder.group({
      control: this.control
    })

    this.service.currentlyEditing.subscribe((key: string) => {
      if(this.editing && key != this.key) {
        this.wasFocused = false;
        this.cancel();
      }
    })
  }

  startEdit() {
    if(this.editing) {
      return;
    }
    
    this.wasFocused = this.focused;
    this.focused = false;

    this.service.startEdit(this.key);

    this.submitted = false;
    this.editingValue = this.value;
    this.editing = true;

    let sub = this.number.changes.subscribe((l: QueryList<NumberComponent>) => {
      if(l.length) {
        l.first.focus();
        sub.unsubscribe();
      }
    })
  }

  ok() {
    this.submitted = true;
    if(!this.control.valid) {
      this.setValidationMessage();
      return;
    }

    if(this.wasFocused) {
      this.wasFocused = false;
      let sub = this.edit.changes.subscribe((l: QueryList<EditableEditButtonComponent>) => {
        if(l.length) {
          l.first.takeFocus();
          sub.unsubscribe();
        }
      })
    }

    this.value = this.editingValue;
    this.valueChange.emit(this.value);
    this.editing = false;
  }

  cancel() {
    if(this.wasFocused) {
      this.wasFocused = false;
      let sub = this.edit.changes.subscribe((l: QueryList<EditableEditButtonComponent>) => {
        if(l.length) {
          l.first.takeFocus();
          sub.unsubscribe();
        }
      })
    }

    this.editing = false;
  }

  setValidationMessage() {
    if(!this.submitted || this.control.valid) {
      this.validationMessage = '';
      return;
    }

    for(let e in this.control.errors) {
      this.validationMessage = this.messages[e] ? this.messages[e] : e;
      return;
    }
  }
}