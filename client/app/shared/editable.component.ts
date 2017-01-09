import { Component, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { FocusDirective } from './focus.directive'

@Component({
  selector: 'cc-editable',
  directives: [FocusDirective],
  template: `
    <div class="{{className}} editable" #parent=cc-focus cc-focus (focus)="onParentFocus()" (blur)="onParentBlur(true)">
      <input type="checkbox" *ngIf="!editing" style="position: absolute;left:-1000px" cc-focus [tabindex]="tabindex" />
      <div class="editable-display" *ngIf="!editing" (click)="startEdit()">
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
  editStart = new EventEmitter<boolean>()

  @Output()
  editEnd = new EventEmitter<boolean>()

  startEdit() {
    this.tabbedInto = false;
    this.parent.beFocused();
  }

  onParentFocus() {
    this.editing = true;
    this.editStart.emit(this.tabbedInto);
  }

  onParentBlur(success: boolean) {
    this.editing = false;
    this.editEnd.emit(true);
    this.tabbedInto = true;
  }
}