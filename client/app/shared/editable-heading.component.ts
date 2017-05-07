import { Component, OnInit, Input, Output, Inject, forwardRef, ViewChildren, QueryList, EventEmitter, ViewChild, ElementRef, Renderer, ChangeDetectorRef } from '@angular/core';
import { Control, Validators, FORM_DIRECTIVES, FormBuilder, ControlGroup } from '@angular/common'
import { TextComponent } from './input.component'
import { EditableEditButtonComponent } from './editable-edit-button.component'
import { EditableButtonsComponent } from './editable-buttons.component'
import { EditableService } from './editable.service'

@Component({
  selector: 'cc-editable-heading',
  template: `
    <div class="editable editable-heading" [class.editable-display-clickable]="!editing" (click)="startEdit()">
      <span class="editable-display" [style.visibility]="editing? 'hidden' : 'visible'">
        <h3 *ngIf="value">{{value}}</h3>
        <h3 class="muted" *ngIf="!value">None</h3>
        <cc-editable-button icon="edit" *ngIf="!editing" (click)="startEdit()"></cc-editable-button>
      </span>
      <form class="editable-background" [class.submitted]="submitted" *ngIf="editing">
        <cc-text #text
                 [(value)]="editingValue"
                 [control]="control"
                 [messages]="messages">
        </cc-text>
        <cc-editable-buttons [disabled]="submitted && !control.valid" (ok)="ok()" (cancel)="cancel()"></cc-editable-buttons>
      </form>
    </div>
  `,
  directives: [EditableEditButtonComponent, TextComponent, EditableButtonsComponent]
})
export class EditableHeadingComponent implements OnInit {
  editing: boolean;
  editingValue: string;
  control: Control;
  form: ControlGroup;
  submitted = false;

  @Input()
  value: string

  @Input()
  validators: any[]

  @Input()
  messages: any

  @Output()
  valueChange = new EventEmitter<string>()

  @ViewChildren('text')
  text: QueryList<TextComponent>

  constructor(private builder: FormBuilder,
      @Inject(forwardRef(() => EditableService))
      private service: EditableService) {
  }

  ngOnInit() {
    this.control = new Control('', Validators.compose(this.validators))
    this.form = this.builder.group({
      control: this.control
    })

    this.service.currentlyEditing.subscribe((e: any) => {
      if(this.editing && e != this) {
        this.cancel();
      }
    })
  }

  startEdit() {
    if(this.editing) {
      return;
    }

    this.service.startEdit(this);

    this.submitted = false;
    this.editingValue = this.value;
    this.editing = true;

    let sub = this.text.changes.subscribe((l: QueryList<TextComponent>) => {
      if(l.length) {
        l.first.focus();
        sub.unsubscribe();
      }
    })
  }

  ok() {
    this.submitted = true;
    if(!this.control.valid) {
      return;
    }

    this.value = this.editingValue;
    this.valueChange.emit(this.value);

    this.editing = false;
  }

  cancel() {
    this.editing = false;
  }
}