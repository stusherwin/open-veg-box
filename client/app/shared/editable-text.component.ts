import { Component, OnInit, Input, Output, Inject, forwardRef, ViewChildren, QueryList, EventEmitter, ViewChild, ElementRef, Renderer, ChangeDetectorRef } from '@angular/core';
import { Control, Validators, FORM_DIRECTIVES, FormBuilder, ControlGroup } from '@angular/common'
import { TextComponent } from './input.component'
import { EditableEditButtonComponent } from './editable-edit-button.component'
import { EditableButtonsComponent } from './editable-buttons.component'
import { EditableStartOnClickDirective } from './editable-start-on-click.directive'
import { EditableService } from './editable.service'

@Component({
  selector: 'cc-editable-text',
  template: `
    <div class="editable editable-text" [class.editable-display-clickable]="!editing" cc-editable-start-on-click [key]="key" [disabled]="editing">
      <span class="editable-display" [style.visibility]="editing? 'hidden' : 'visible'">
        <span class="editable-display-value" *ngIf="value">{{value}}</span>
        <span class="editable-display-value muted" *ngIf="!value">None</span>
        <cc-editable-button [key]="key" icon="edit" *ngIf="!editing"></cc-editable-button>
      </span>
      <form class="editable-background" [class.submitted]="submitted" *ngIf="editing">
        <cc-text #text
                 [(value)]="editingValue"
                 [control]="control"
                 [messages]="messages">
        </cc-text>
        <cc-editable-buttons [key]="key" [disabled]="submitted && !control.valid" (ok)="ok()"></cc-editable-buttons>
      </form>
    </div>
  `,
  directives: [EditableEditButtonComponent, TextComponent, EditableButtonsComponent, EditableStartOnClickDirective]
})
export class EditableTextComponent implements OnInit {
  editing: boolean;
  editingValue: string;
  control: Control;
  form: ControlGroup;
  submitted = false;

  @Input()
  key: string

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

    this.service.currentlyEditing.subscribe((key: string) => {
      if(!this.editing && key == this.key) {
        this.editing = true;
        this.startEdit();
      } else if(this.editing && key != this.key) {
        setTimeout(() => this.editing = false)
      }
    })
  }

  startEdit() {
    this.submitted = false;
    this.editingValue = this.value;

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
  }
}