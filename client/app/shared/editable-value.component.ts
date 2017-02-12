import { Component, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { ActiveElementDirective, ActivateOnFocusDirective } from './active-elements'

@Component({
  selector: 'cc-editable-value',
  directives: [ActiveElementDirective],
  template: `
    <div class="{{className}} editable-value" [class.editing]="editing" (keydown)="onKeyDown($event)" #active=cc-active cc-active (activate)="onActivate()" (deactivate)="onDeactivate()">
      <div class="editable-value-display" (click)="onClick()">
        <ng-content select="display"></ng-content>
      </div>
      <div class="editable-value-outer">
        <div class="editable-value-edit" [class.invalid]="!valid">
          <ng-content select="edit"></ng-content>
          <a (click)="onOkClick()"><i class="icon-ok"></i></a>
          <a (click)="onCancelClick()"><i class="icon-cancel"></i></a>
        </div>
      </div>
    </div>
  `
})
export class EditableValueComponent {
  editing = false;
  
  @Input()
  className: string

  @Input()
  valid: boolean

  @ViewChild('active')
  active: ActiveElementDirective

  @Output()
  start = new EventEmitter<void>()

  @Output()
  ok = new EventEmitter<void>()

  @Output()
  cancel = new EventEmitter<void>()

  startEdit() {
    this.onClick();
  }

  onClick() {
    if(!this.editing) {
      this.editing = true;
      this.start.emit(null);
    }
  }

  onOkClick() {
    if(!this.valid) {
      return;
    }

    this.ok.emit(null);
  }

  onCancelClick() {
    this.cancel.emit(null);
  }

  endEdit() {
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

  onActivate() {
  }

  onDeactivate() {
    if(this.tabbedAway && this.valid) {
      this.onOkClick();
    } else {
      this.onCancelClick();
    }
  }
}