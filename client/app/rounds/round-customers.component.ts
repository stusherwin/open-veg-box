import { Component, Directive, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { FocusDirective } from '../shared/focus.directive'
import { HighlightableDirective } from '../shared/highlightable.directive'
import { RoundCustomer } from './round'

@Component({
  selector: 'cc-round-customers',
  directives: [FocusDirective, HighlightableDirective],
  template: `
    <div class="round-customers editable">
      <input type="checkbox" *ngIf="!editing" style="position: absolute;left:-1000px" (focus)="startEdit()" [tabindex]="editTabindex" />
      <div class="editable-display" *ngIf="!editing" (click)="startEdit()">
        <p *ngIf="!value || !value.length">No customers</p>
        <ul *ngIf="value.length">
          <li *ngFor="let c of value">{{c.name}}</li>
        </ul>
      </div>
      <div class="editable-edit" *ngIf="editing">
        <ul>
          <li *ngFor="let c of customers; let i = index" cc-highlightable>
            <input [id]="'customer' + c.id" type="checkbox" cc-focus [grab]="i == 0" highlight="true" [checked]="isOnRound(c)" [tabindex]="editTabindex" (change)="setOnRound(c, $event)" (focus)="onChildFocus($event)" (blur)="onChildBlur($event)" />
            <label [htmlFor]="'customer' + c.id" (focus)="onChildFocus($event)">{{c.name}}</label>
          </li>
        </ul>     
      </div>
    </div>
  `
})
export class RoundCustomersComponent {
  shouldBlur: boolean;
  
  @ViewChild('priceElem')
  priceElem: ElementRef;

  @ViewChild('unitTypeElem')
  unitTypeElem: ElementRef;

  @Input()
  editing: boolean;

  @Input()
  addMode: boolean;

  @Input()
  editTabindex: number;

  @Input()
  value: RoundCustomer[];

  @Input()
  customers: RoundCustomer[];

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

  isOnRound(customer: RoundCustomer) {
    return this.value.map(c => c.id).indexOf(customer.id) >= 0;
  }

  setOnRound(customer: RoundCustomer, evt: any) {
    if( evt.target.checked ) {
      this.value.push(customer);
    } else {
      let index = this.value.findIndex( c => c.id == customer.id);
      if(index >= 0) {
        this.value.splice(index, 1);
      }
    }
  }
}