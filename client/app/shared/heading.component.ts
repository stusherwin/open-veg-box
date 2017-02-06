import { Component, Input, ViewChild, ElementRef, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { FocusDirective } from './focus.directive'

@Component({
  selector: 'cc-heading',
  directives: [FocusDirective],
  template: `
    <div class="heading-new">
      <h3 *ngIf="!editing" (click)="editing = true">{{value}}<a><i class="icon-edit"></i></a></h3>
      <div *ngIf="editing" class="edit-background">
        <i class="icon-ok" (click)="onEditOkClick()"></i><i class="icon-cancel" (click)="onEditCancelClick()"></i>
      </div>
      <div *ngIf="editing">
        <input type="text" (click)="editing = false" #focusable=cc-focus cc-focus [selectAll]="addMode" [(ngModel)]="value" (ngModelChange)="valueChanged($event)" [tabindex]="editTabindex" />
      </div>
    </div>
  `
}) 
export class HeadingComponent implements AfterViewInit {
  @Input()
  value: string;

  @Input()
  editTabindex: number;

  @Input()
  addMode: boolean;

  @ViewChild('focusable')
  focusable: FocusDirective;

  @Output()
  valueChange = new EventEmitter<string>();

  @Output()
  update = new EventEmitter<any>();

  ngAfterViewInit() {
  }

  valueChanged(value: string) {
    this.valueChange.emit(value);
  }

  startEdit() {
  }
}