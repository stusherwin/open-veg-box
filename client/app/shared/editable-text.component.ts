import { Component, OnInit, Input, Output, Inject, forwardRef, ViewChildren, QueryList, EventEmitter, ViewChild, ElementRef, Renderer, ChangeDetectorRef, HostListener } from '@angular/core';
import { Control, Validators, FORM_DIRECTIVES, FormBuilder, ControlGroup } from '@angular/common'
import { TextComponent } from './input.component'
import { EditableEditButtonComponent } from './editable-edit-button.component'
import { EditableButtonsComponent } from './editable-buttons.component'
import { EditableService } from './editable.service'

@Component({
  selector: 'cc-editable-text',
  template: `
    <div class="editable editable-text" [class.editable-display-clickable]="!editing" [class.hover]="focused" (click)="startEdit()">
      <span class="editable-display" [style.visibility]="editing? 'hidden' : 'visible'">
        <span class="editable-display-value" *ngIf="value">{{value}}</span>
        <span class="editable-display-value muted" *ngIf="!value">None</span>
        <cc-editable-button #edit [key]="key" icon="edit" *ngIf="!editing" (click)="startEdit()" (focus)="focused = true" (blur)="focused = false"></cc-editable-button>
      </span>
      <form class="editable-background" [class.submitted]="submitted" *ngIf="editing">
        <cc-text #text
                 [(value)]="editingValue"
                 [control]="control"
                 [messages]="messages">
        </cc-text>
        <cc-editable-buttons [key]="key" [disabled]="submitted && !control.valid" (ok)="ok()" (cancel)="cancel()"></cc-editable-buttons>
      </form>
    </div>
  `,
  directives: [EditableEditButtonComponent, TextComponent, EditableButtonsComponent]
})
export class EditableTextComponent implements OnInit {
  editing: boolean;
  editingValue: string;
  control: Control;
  form: ControlGroup;
  submitted = false;
  focused = false;
  wasFocused = false;

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

  @ViewChildren('edit')
  edit: QueryList<EditableEditButtonComponent>

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
}