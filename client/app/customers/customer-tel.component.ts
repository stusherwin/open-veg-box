import { Component, Directive, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { FocusDirective } from '../shared/focus.directive'
import { HighlightableDirective } from '../shared/highlightable.directive'

@Component({
  selector: 'cc-customer-tel',
  directives: [FocusDirective, HighlightableDirective],
  template: `
    <div class="editable">
      <input type="checkbox" *ngIf="!editing" style="position: absolute;left:-1000px" (focus)="startEdit()" [tabindex]="editTabindex" />
      <div class="editable-display" *ngIf="!editing" (click)="startEdit()">
        {{ value }}
      </div>
      <div class="editable-edit" *ngIf="editing">
        <input type="text" [(ngModel)]="value" cc-focus grab="true" highlight="true" [tabindex]="editTabindex" (focus)="onChildFocus($event)" (blur)="onChildBlur($event)" />
      </div>
    </div>
  `
})
export class CustomerTelComponent {
  shouldBlur: boolean;
  
  @Input()
  editing: boolean;

  @Input()
  addMode: boolean;

  @Input()
  editTabindex: number;

  @Input()
  value: string;

  @Output()
  focus = new EventEmitter<any>();

  @Output()
  blur = new EventEmitter<any>();

  startEdit() {
    this.focus.emit({type: "focus", srcElement: this});
    this.editing = true;
  }

  endEdit() {
    this.editing = false;
    this.blur.emit({type: "blur", srcElement: this});
  }

  onChildFocus(event: FocusEvent) {
    this.shouldBlur = false;
  }

  onChildBlur(event:FocusEvent) {
    this.shouldBlur = true;
    setTimeout(() => {
      if(this.shouldBlur) {
        this.endEdit();
        this.shouldBlur = true;
      }
    }, 100);
  }
}