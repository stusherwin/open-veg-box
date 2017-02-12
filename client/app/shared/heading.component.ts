import { Component, Input, ViewChild, ElementRef, Output, EventEmitter, OnInit, AfterViewInit, Renderer } from '@angular/core';
import { ActiveElementDirective, ActivateOnFocusDirective } from './active-elements'
import { ValidatableComponent } from '../shared/validatable.component';

@Component({
  selector: 'cc-heading',
  directives: [ActiveElementDirective, ActivateOnFocusDirective, ValidatableComponent],
  template: `
    <div class="x-heading editable-value" [class.editing]="editing" (keydown)="onKeyDown($event)" #active=cc-active cc-active (deactivate)="onDeactivate()">
      <div class="editable-value-display" (click)="onClick()">
        <h3>{{value}}</h3>
        <a><i class="icon-edit"></i></a>
      </div>
      <div class="editable-value-outer">
        <div class="editable-value-edit" [class.invalid]="!valid">
          <cc-validatable [valid]="valid" message="Heading should not be empty">
            <input type="text" #input [(ngModel)]="editingValue" [tabindex]="editTabindex" (focus)="onFocus()" cc-active cc-activate-on-focus />
          </cc-validatable>
          <a (click)="onOkClick()"><i class="icon-ok"></i></a>
          <a (click)="onCancelClick()"><i class="icon-cancel"></i></a>
        </div>
      </div>
    </div>
  `
}) 
export class HeadingComponent implements OnInit, AfterViewInit {
  editingValue: string;
  editing = false;

  @Input()
  value: string;

  @Input()
  editTabindex: number;

  @Input()
  addMode: boolean;

  @ViewChild('input')
  input: ElementRef;

  @ViewChild('active')
  active: ActiveElementDirective

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
  }

  ngAfterViewInit() {
  }

  startEdit() {
    this.onClick();
  }

  onFocus() {
    if(this.editing) {
      return;
    }

    this.onClick();
  }

  onClick() {
    this.editingValue = this.value;
    this.editing = true;
    
    setTimeout(() => this.renderer.invokeElementMethod(this.input.nativeElement, 'focus', []))
  }

  onOkClick() {
    if(!this.valid) {
      return;
    }

    this.value = this.editingValue;
    
    //TODO: just one event!
    this.valueChange.emit(this.value);
    this.update.emit(null);
    
    this.editing = false;
    this.tabbedAway = false;
    this.active.makeInactive()
  }

  onCancelClick() {
    this.editing = false;
    this.tabbedAway = false;
    this.active.makeInactive()
  }

  tabbedAway = false;
  onKeyDown(event: KeyboardEvent) {
    if(!this.editing) {
      return;
    }

    if(event.key == 'Enter' && this.valid) {
      this.onOkClick();
    } else if(event.key == 'Escape') {
      this.onCancelClick();
    } else if(event.key == 'Tab') {
      this.tabbedAway = !event.shiftKey;
    }
  }

  onDeactivate() {
    if(this.tabbedAway && this.valid) {
      this.onOkClick();
    } else {
      this.onCancelClick();
    }
  }
}