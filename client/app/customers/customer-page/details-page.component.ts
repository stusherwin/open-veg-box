import { Component, OnInit, Input, Output, Inject, forwardRef, ViewChildren, QueryList, EventEmitter, ViewChild, ElementRef, Renderer, ChangeDetectorRef } from '@angular/core';
import { ActiveElementDirective } from '../../shared/active-elements'
import { CustomerModel } from './customer.model'
import { OrderComponent } from '../orders/order.component'
import { PreserveLinesPipe, MoneyPipe } from '../../shared/pipes'
import { Customer } from '../customer'
import { CustomerPageService } from './customer-page.component'
import { CustomerService } from '../customer.service'
import { EditableEditButtonComponent } from '../../shared/editable-edit-button.component'
import { EditableButtonsComponent } from '../../shared/editable-buttons.component'
import { TextComponent, TextAreaComponent } from '../../shared/input.component'
import { Control, Validators, FORM_DIRECTIVES, FormBuilder, ControlGroup } from '@angular/common'

@Component({
  selector: 'cc-editable',
  template: `
    <div class="editable" [class.editable-display-clickable]="!editing" (click)="startEdit()">
      <span class="editable-display" [style.visibility]="editing? 'hidden' : 'visible'">
        <span *ngIf="value">{{value}}</span>
        <span class="muted" *ngIf="!value">None</span>
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
  directives: [EditableEditButtonComponent, TextComponent, EditableButtonsComponent],
  pipes: [PreserveLinesPipe, MoneyPipe]
})
export class EditableComponent implements OnInit {
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

  constructor(private builder: FormBuilder) {
  }

  ngOnInit() {
    this.control = new Control('', Validators.compose(this.validators))
    this.form = this.builder.group({
      control: this.control
    })
  }

  startEdit() {
    if(this.editing) {
      return;
    }

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


@Component({
  selector: 'cc-editable-area',
  template: `
    <div class="editable" [class.editable-display-clickable]="!editing" (click)="startEdit()">
      <span class="editable-display" [style.visibility]="editing? 'hidden' : 'visible'">
        <div class="multiline-text" #display>
          <span *ngIf="value" innerHTML="{{value | preserveLines}}"></span>
          <span class="muted" *ngIf="!value">None</span>
        </div>
        <cc-editable-button icon="edit" *ngIf="!editing" (click)="startEdit()"></cc-editable-button>
      </span>
      <form class="editable-background" [class.submitted]="submitted" *ngIf="editing">
        <cc-textarea #text
                     [(value)]="editingValue"
                     [control]="control"
                     [messages]="messages"
                     [height]="textAreaHeight"><!--display.getBoundingClientRect().height">-->
        </cc-textarea>
        <cc-editable-buttons [disabled]="submitted && !control.valid" (ok)="ok()" (cancel)="cancel()"></cc-editable-buttons>
      </form>
    </div>
  `,
  directives: [EditableEditButtonComponent, TextAreaComponent, EditableButtonsComponent],
  pipes: [PreserveLinesPipe, MoneyPipe]
})
export class EditableAreaComponent implements OnInit {
  editing: boolean;
  editingValue: string;
  control: Control;
  form: ControlGroup;
  submitted = false;
  textAreaHeight: number = 0;

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

  constructor(private builder: FormBuilder, private renderer: Renderer, private changeDetector: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.control = new Control('', Validators.compose(this.validators))
    this.form = this.builder.group({
      control: this.control
    })
  }

  startEdit() {
    if(this.editing) {
      return;
    }

    this.textAreaHeight = this.display.nativeElement.getBoundingClientRect().height + 5;
    this.submitted = false;
    this.editingValue = this.value;
    this.editing = true;
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

    this.editing = false;
  }

  cancel() {
    this.editing = false;
  }
}



@Component({
  selector: 'cc-details-page',
  templateUrl: 'app/customers/customer-page/details-page.component.html',
  directives: [OrderComponent, ActiveElementDirective, EditableEditButtonComponent, TextComponent, EditableButtonsComponent, EditableComponent, EditableAreaComponent],
  pipes: [PreserveLinesPipe, MoneyPipe]
})
export class DetailsPageComponent implements OnInit {
  model: CustomerModel;

  firstNameValidators = [Validators.required];

  constructor(
      @Inject(forwardRef(() => CustomerPageService))
      private page: CustomerPageService,
      private customerService: CustomerService,
      private builder: FormBuilder) {
    this.model = new CustomerModel(page.customer, customerService);
  }

  ngOnInit() {
  }
}