import { Component, OnInit, Input, Output, Inject, forwardRef, ViewChildren, QueryList, EventEmitter, ViewChild, ElementRef, Renderer, ChangeDetectorRef, HostListener } from '@angular/core';
import { Control, Validators, FORM_DIRECTIVES, FormBuilder, ControlGroup } from '@angular/common'
import { SelectComponent } from './select.component'
import { EditableEditButtonComponent } from './editable-edit-button.component'
import { EditableButtonsComponent } from './editable-buttons.component'
import { EditableService } from './editable.service'

@Component({
  selector: 'cc-editable-select',
  template: `
    <div class="editable editable-text" [class.editable-display-clickable]="!editing" [class.hover]="focused" (click)="startEdit()">
      <span class="editable-display" [style.visibility]="editing? 'hidden' : 'visible'">
        <span class="editable-display-value" *ngIf="value">{{getText(value)}}</span>
        <span class="editable-display-value muted" *ngIf="!value">None</span>
        <cc-editable-button #edit [key]="key" icon="edit" *ngIf="!editing" (action)="startEdit()" (focus)="focused = true" (blur)="focused = false"></cc-editable-button>
      </span>
      <form class="editable-background" *ngIf="editing">
        <cc-select #select
                   [value]="getValue(editingValue)"
                   (valueChange)="valueChanged($event)"
                   [options]="options"
                   [textProperty]="textProperty"
                   [valueProperty]="valueProperty">
        </cc-select>
        <cc-editable-buttons (ok)="ok()"
                             (cancel)="cancel()">
        </cc-editable-buttons>
      </form>
    </div>
  `,
  directives: [EditableEditButtonComponent, SelectComponent, EditableButtonsComponent]
})
export class EditableSelectComponent implements OnInit {
  editing: boolean;
  editingValue: any;
  focused = false;
  wasFocused = false;
  validationMessage: string;

  @Input()
  key: string

  @Input()
  value: any

  @Input()
  textProperty: string

  @Input()
  valueProperty: string

  @Input()
  options: any[]

  @Output()
  valueChange = new EventEmitter<any>()

  valueChanged($event: any) {
    this.editingValue = this.options.find(o => this.getValue(o) == $event);
  }

  @ViewChildren('select')
  text: QueryList<SelectComponent>

  @ViewChildren('edit')
  edit: QueryList<EditableEditButtonComponent>

  constructor(private builder: FormBuilder,
    @Inject(forwardRef(() => EditableService))
    private service: EditableService) {
  }

  getText(value: any) {
    return this.textProperty ? value[this.textProperty] : value;
  }

  getValue(value: any) {
    return this.valueProperty ? value[this.valueProperty] : value;
  }

  ngOnInit() {
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

    this.editingValue = this.value;
    this.editing = true;

    let sub = this.text.changes.subscribe((l: QueryList<SelectComponent>) => {
      if(l.length) {
        l.first.focus();
        sub.unsubscribe();
      }
    })
  }

  ok() {
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