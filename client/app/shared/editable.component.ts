import { Component, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { FocusDirective } from './focus.directive'

@Component({
  selector: 'cc-editable',
  directives: [FocusDirective],
  template: `
    <div class="{{className}} editable" #parent=cc-focus cc-focus (focus)="startEditing()" (blur)="endEditing()">
      <input type="checkbox" *ngIf="!editing" style="position: absolute;left:-1000px" cc-focus [tabindex]="tabindex" />
      <div class="editable-display" *ngIf="!editing" (click)="click()">
        <ng-content select="[display]"></ng-content>
      </div>
      <div class="editable-edit" *ngIf="editing">
        <ng-content select="[edit]"></ng-content>
      </div>
    </div>
  `
})
export class EditableComponent {
  editing: boolean;
  tabbedInto: boolean = true;

  @Input()
  tabindex: number;

  @Input()
  className: string;

  @ViewChild('parent')
  parent: FocusDirective;

  @Output()
  startEdit = new EventEmitter<boolean>()

  @Output()
  endEdit = new EventEmitter<any>()

  click() {
    this.tabbedInto = false;
    this.parent.beFocused();
  }

  startEditing() {
    this.editing = true;
    this.startEdit.emit(this.tabbedInto);
  }

  endEditing() {
    this.editing = false;
    this.endEdit.emit(null);
    this.tabbedInto = true;
  }
}