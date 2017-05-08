import { Component, OnInit, Input, Output, Inject, forwardRef, ViewChildren, QueryList, EventEmitter, ViewChild, ElementRef, Renderer, ChangeDetectorRef, HostListener } from '@angular/core';
import { Control, Validators, FORM_DIRECTIVES, FormBuilder, ControlGroup } from '@angular/common'
import { TextComponent, TextAreaComponent } from './input.component'
import { EditableEditButtonComponent } from './editable-edit-button.component'
import { EditableButtonsComponent } from './editable-buttons.component'
import { PreserveLinesPipe } from './pipes'
import { EditableService } from './editable.service'
import { EditableStartOnClickDirective } from './editable-start-on-click.directive'

@Component({
  selector: 'cc-editable-textarea',
  template: `
    <div class="editable editable-textarea" [class.editable-display-clickable]="!editing" cc-editable-start-on-click [key]="key" [disabled]="editing">
      <span class="editable-display" [style.visibility]="editing? 'hidden' : 'visible'">
        <div class="editable-display-value" #display>
          <span *ngIf="value" innerHTML="{{value | preserveLines}}"></span>
          <span class="muted" *ngIf="!value">None</span>
        </div>
        <cc-editable-button [key]="key" icon="edit" *ngIf="!editing"></cc-editable-button>
      </span>
      <form class="editable-background" [class.submitted]="submitted" *ngIf="editing">
        <cc-textarea #text
                     [(value)]="editingValue"
                     [control]="control"
                     [messages]="messages"
                     [height]="textAreaHeight">
        </cc-textarea>
        <cc-editable-buttons [key]="key" [disabled]="submitted && !control.valid" (ok)="ok()"></cc-editable-buttons>
      </form>
    </div>
  `,
  directives: [EditableEditButtonComponent, TextAreaComponent, EditableButtonsComponent, EditableStartOnClickDirective],
  pipes: [PreserveLinesPipe]
})
export class EditableTextAreaComponent implements OnInit {
  editing: boolean;
  editingValue: string;
  control: Control;
  form: ControlGroup;
  submitted = false;
  textAreaHeight: number = 0;

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
  text: QueryList<TextAreaComponent>

  @ViewChild('display')
  display: ElementRef

  constructor(private builder: FormBuilder, private renderer: Renderer, private changeDetector: ChangeDetectorRef,
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
        setTimeout(() => this.editing = false);
      }
    })
  }

  startEdit() {
    this.textAreaHeight = this.display.nativeElement.getBoundingClientRect().height + 5;
    this.submitted = false;
    this.editingValue = this.value;
    this.changeDetector.detectChanges();

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