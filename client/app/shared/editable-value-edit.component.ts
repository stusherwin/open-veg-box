import { Component, Input, ViewChild, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'cc-editable-value-edit',
  template: `
    <div class="editable-value-outer">
      <div class="editable-value-edit" [class.invalid]="!valid">
        <span class="box-product-quantity-each" *ngIf="unitType == 'each'">x</span>
        <span class="input-wrapper" [class.invalid]="!valid"><input cc-active cc-activate-on-focus type="text" #input [(ngModel)]="editingValue" (ngModelChange)="validate()" [tabindex]="editTabindex" (focus)="onFocus()" />
        <i *ngIf="!valid" class="icon-warning" title="Quantity should be a number greater than 0"></i></span>
        <span class="box-product-quantity-perkg" *ngIf="unitType == 'perKg'">Kg</span><a (click)="onOkClick()" tabindex="9999"><i class="icon-ok"></i></a><a (click)="onCancelClick()" tabindex="9999"><i class="icon-cancel"></i></a>
      </div>
    </div>
  `
})
export class EditableValueEditComponent {
}