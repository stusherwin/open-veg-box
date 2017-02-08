import { Component, Input, ViewChild, ElementRef, Output, EventEmitter, OnInit, AfterViewInit, Renderer } from '@angular/core';
import { FocusDirective } from './focus.directive'

@Component({
  selector: 'cc-heading',
  directives: [FocusDirective],
  template: `
    <div class="heading-new" [class.invalid]="!valid" (keydown)="onKeyDown($event)" #container=cc-focus cc-focus (blur)="onContainerBlur()">
      <h3 *ngIf="!editing" (click)="onClick()">{{value}}<a><i class="icon-edit"></i></a></h3>
      <div *ngIf="editing" class="edit-background">
        <i *ngIf="!valid" class="icon-warning"></i>
        <i class="icon-ok" (click)="onOkClick()"></i><i class="icon-cancel" (click)="onCancelClick()"></i>
      </div>
      <input type="text" style="position: absolute;left:-10000px" *ngIf="!editing" [tabindex]="editTabindex" (focus)="onFocus()" />
      <div *ngIf="editing">
        <input type="text" #input [(ngModel)]="editingValue" (ngModelChange)="validate()" [tabindex]="editTabindex" />
      </div>
    </div>
  `
}) 
export class HeadingComponent implements OnInit, AfterViewInit {
  originalValue: string;
  editingValue: string;
  editing = false;
  valid = true;

  @Input()
  value: string;

  @Input()
  editTabindex: number;

  @Input()
  addMode: boolean;

  @ViewChild('container')
  container: FocusDirective;

  @ViewChild('input')
  input: ElementRef;

  @Output()
  valueChange = new EventEmitter<string>();

  @Output()
  update = new EventEmitter<any>();

  constructor(private renderer: Renderer) {
  }

  ngOnInit() {
    this.originalValue = this.value;
  }

  ngAfterViewInit() {
  }

  startEdit() {
    this.onClick();
  }

  onFocus() {
    if(this.editing) {
      return;
    }

    this.onClick();
  }

  onClick() {
    this.editingValue = this.value;
    this.editing = true;
    this.valid = true;
    let selectAll = this.addMode && this.editingValue == this.originalValue; 
    
    setTimeout(() => {
      let elem = this.input.nativeElement;
      this.renderer.invokeElementMethod(elem, 'focus', []);

      let selectionStart = selectAll? 0 : elem.value.length;
      this.renderer.invokeElementMethod(elem, 'setSelectionRange', [selectionStart, elem.value.length]);
    })

    this.container.beFocused();
  }

  onOkClick() {
    this.value = this.editingValue;
    
    //TODO: just one event!
    this.valueChange.emit(this.value);
    this.update.emit(null);
    
    this.editing = false;
    this.tabbedAway = false;
  }

  onCancelClick() {
    this.editing = false;
    this.tabbedAway = false;
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
    } else if(event.key == 'Tab' && !event.shiftKey) {
      this.tabbedAway = true;
    }
  }

  onContainerBlur() {
    if(this.tabbedAway && this.valid) {
      this.onOkClick();
    } else {
      this.onCancelClick();
    }
  }

  validate() {
    this.valid = !!this.editingValue.length;
  }
}