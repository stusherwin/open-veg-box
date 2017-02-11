import { Component, Input, ViewChild, ElementRef, Output, EventEmitter, OnInit, AfterViewInit, Renderer } from '@angular/core';
import { ActiveDirective, ActiveParentDirective, ActivateOnFocusDirective } from './active-elements'

@Component({
  selector: 'cc-heading',
  directives: [ActiveDirective, ActiveParentDirective, ActivateOnFocusDirective],
  template: `
    <div class="x-heading editable-value" [class.editing]="editing" (keydown)="onKeyDown($event)" cc-active cc-active-parent (deactivate)="onDeactivate()">
      <h3 class="editable-value-display" (click)="onClick()">{{value}}<a><i class="icon-edit"></i></a></h3>
      <div class="editable-value-outer">
        <div class="editable-value-edit" [class.invalid]="!valid">
          <span class="input-wrapper" [class.invalid]="!valid"><input type="text" #input [(ngModel)]="editingValue" (ngModelChange)="validate()" [tabindex]="editTabindex" (focus)="onFocus()" cc-active cc-activate-on-focus />
          <i *ngIf="!valid" class="icon-warning" title="Heading should not be empty"></i></span><a (click)="onOkClick()"><i class="icon-ok"></i></a><a (click)="onCancelClick()"><i class="icon-cancel"></i></a>
        </div>
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
    
    setTimeout(() => this.renderer.invokeElementMethod(this.input.nativeElement, 'focus', []))
  }

  onOkClick() {
    if(!this.valid) {
      return;
    }

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
    } else if(event.key == 'Tab') {
      this.tabbedAway = !event.shiftKey;
    }
  }

  onDeactivate() {
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