import { Component, Input, ViewChild, Output, EventEmitter, ContentChildren, AfterViewInit, QueryList } from '@angular/core';
import { ActiveElementDirective, ActivateOnFocusDirective } from './active-elements'
import { ValidatableComponent } from './validatable.component';

@Component({
  selector: 'cc-editable-value',
  directives: [ActiveElementDirective],
  template: `
    <div class="{{className}} editable-value"
      [class.editing]="editing"
      (keydown)="onKeyDown($event)" #active=cc-active cc-active (activate)="onActivate()" (deactivate)="onDeactivate()">
      <div class="editable-value-display" (click)="startEdit()">
        <ng-content select="display"></ng-content>
      </div>
      <div class="editable-value-outer">
        <div class="editable-value-edit" [class.invalid]="!valid">
          <ng-content select="edit"></ng-content>
          <a (click)="onOk()"><i class="icon-ok"></i></a>
          <a (click)="onCancel()"><i class="icon-cancel"></i></a>
        </div>
      </div>
    </div>
    <input type="text" *ngIf="editing && catchTabAway" [tabindex]="tabindex" style="position: absolute; left: -10000px" (focus)="onDeactivate()" />
  `
})
export class EditableValueComponent implements AfterViewInit {
  validated = false;
  editing = false;
  okKeyDownEnabled = false;
  
  @Input()
  className: string

  @Input()
  catchTabAway: boolean

  @Input()
  tabindex: number

  @Input()
  okOnEnter: boolean = true

  @Input()
  addMode: boolean;

  @ViewChild('active')
  active: ActiveElementDirective

  @ContentChildren(ValidatableComponent)
  validatables: QueryList<ValidatableComponent>

  @Output()
  start = new EventEmitter<void>()

  @Output()
  ok = new EventEmitter<boolean>()

  @Output()
  cancel = new EventEmitter<void>()

  ngAfterViewInit() {
  }

  get valid() {
    return !this.validated
      || !this.validatables
      || !this.validatables.length
      || this.validatables.toArray().every(v => v.valid);
  }

  validate() {
    this.validated = true;
  }

  startEdit() {
    if(!this.editing) {
      // If Enter key is used to trigger startEdit, then keydown handler will automatically
      // fire. Need a timeout window to prevent this.
      this.okKeyDownEnabled = false;
      setTimeout(() => this.okKeyDownEnabled = true, 100);
      this.editing = true;
      this.start.emit(null);
    }
  }

  onOk() {
    this.validate();

    if(!this.valid) {
      return;
    }

    this.ok.emit(this.tabbedAway);
  }

  onCancel() {
    this.cancel.emit(null);
  }

  endEdit() {
    this.validated = false;
    this.editing = false;
    this.tabbedAway = false;
    this.active.makeInactive()
  }

  tabbedAway = false;
  onKeyDown(event: KeyboardEvent) {
    if(!this.editing) {
      return;
    }

    if(event.key == 'Enter' && this.valid && this.okKeyDownEnabled && this.okOnEnter) {
      this.onOk();
    } else if(event.key == 'Escape') {
      this.onCancel();
    } else if(event.key == 'Tab') {
      this.tabbedAway = !event.shiftKey;
    }
  }

  onActivate() {
  }

  onDeactivate() {
    if(!this.editing) {
      return;
    }

    if(this.tabbedAway) {
      this.validate();

      if(this.valid) {
        this.onOk();
      } else {
        setTimeout(() => {
          this.start.emit(null);
        });
      }
    } else {
      this.onCancel();
    }
  }
}