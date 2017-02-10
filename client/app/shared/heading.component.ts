import { Component, Input, ViewChild, ElementRef, Output, EventEmitter, OnInit, AfterViewInit, Renderer } from '@angular/core';
import { FocusDirective } from './focus.directive'

@Component({
  selector: 'cc-heading',
  directives: [FocusDirective],
  template: `
    <div class="heading-new" (keydown)="onKeyDown($event)" #container=cc-focus cc-focus (blur)="onContainerBlur()">
      <h3 *ngIf="!editing" (click)="onClick()">{{value}}<a><i class="icon-edit"></i></a></h3>
      <input type="text" style="position: absolute;left:-10000px" *ngIf="!editing" [tabindex]="editTabindex" (focus)="onFocus()" />
      <div class="heading-edit" *ngIf="editing">
        <span class="edit-wrapper" [class.invalid]="!valid">
          <span class="input-wrapper"><input type="text" #input [class.invalid]="!valid" [(ngModel)]="editingValue" (ngModelChange)="validate()" [tabindex]="editTabindex" />
          <i *ngIf="!valid" class="icon-warning" title="Heading should not be empty"></i></span><a (click)="onOkClick()"><i class="icon-ok"></i></a><a (click)="onCancelClick()"><i class="icon-cancel"></i></a>
        </span>
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