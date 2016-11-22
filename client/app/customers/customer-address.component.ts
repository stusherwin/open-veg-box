import { Component, Directive, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { FocusDirective } from '../shared/focus.directive'
import { SingleLinePipe } from '../shared/pipes';

@Component({
  selector: 'cc-customer-address',
  directives: [FocusDirective],
  pipes: [SingleLinePipe],
  template: `
    <div class="editable">
      <input type="checkbox" *ngIf="!editing" style="position: absolute;left:-1000px" (focus)="startEdit()" [tabindex]="editTabindex" />
      <div class="editable-display" *ngIf="!editing" (click)="startEdit()" [innerHTML]="value | singleline:', '">
      </div>
      <div class="editable-edit" *ngIf="editing">
        <textarea [(ngModel)]="value" (ngModelChange)="valueChanged($event)" cc-focus grab="true" [tabindex]="editTabindex" (focus)="onChildFocus($event)" (blur)="onChildBlur($event)"></textarea>
      </div>
    </div>
  `
})
export class CustomerAddressComponent {
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