import { Component, Directive, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { FocusDirective } from '../shared/focus.directive'
import { HighlightableDirective } from '../shared/highlightable.directive'

@Component({
  selector: 'cc-customer-email',
  directives: [FocusDirective, HighlightableDirective],
  template: `
    <div class="editable">
      <input type="checkbox" *ngIf="!editing" style="position: absolute;left:-1000px" (focus)="startEdit()" [tabindex]="editTabindex" />
      <div class="editable-display" *ngIf="!editing" (click)="startEdit()">
        {{ value }}
      </div>
      <div class="editable-edit" *ngIf="editing">
        <input type="text" [(ngModel)]="value" (ngModelChange)="valueChanged($event)" cc-focus grab="true" highlight="true" [tabindex]="editTabindex" (focus)="onChildFocus($event)" (blur)="onChildBlur($event)" />
      </div>
    </div>
  `
})
export class CustomerEmailComponent {
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
  valueChange = new EventEmitter<string>();

  @Output()
  focus = new EventEmitter<any>();

  @Output()
  blur = new EventEmitter<any>();

  @Output()
  update = new EventEmitter<any>();
  
  startEdit() {
    this.focus.emit({type: "focus", srcElement: this});
    this.editing = true;
  }

  endEdit() {
    this.editing = false;
    this.blur.emit({type: "blur", srcElement: this});
    this.update.emit(null);
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
  
  valueChanged(value: string) {
    this.valueChange.emit(value);
  }
}