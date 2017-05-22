import { Component, Input, Output, EventEmitter, ViewChild, forwardRef, Inject, ElementRef, OnInit, Renderer, ViewChildren, QueryList, Directive, HostListener, HostBinding, AfterViewInit, ContentChildren, ChangeDetectorRef } from '@angular/core';
import { Arrays } from '../../shared/arrays'
import { MoneyPipe } from '../../shared/pipes'
import { RoundCustomersModel } from './round-customers.model'
import { RoundCustomerModel } from './round-customers.model'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { Subject } from 'rxjs/Subject'
import { Observable } from 'rxjs/Observable'
import 'rxjs/add/operator/distinct'
import { Control, Validators, FORM_DIRECTIVES, FormBuilder, ControlGroup } from '@angular/common'
import { NumberComponent, SelectComponent, ValidationResult } from '../../shared/input.component'
import { EditableEditButtonComponent } from '../../shared/editable-edit-button.component'
import { EditableButtonsComponent } from '../../shared/editable-buttons.component'
import { EditableService } from '../../shared/editable.service'
import { ButtonComponent } from '../../shared/button.component'

@Component({
  selector: '[cc-round-customer]',
  templateUrl: 'app/rounds/round-page/round-customer-new.component.html',
  directives: [EditableEditButtonComponent, EditableButtonsComponent, NumberComponent, SelectComponent, FORM_DIRECTIVES, ButtonComponent],
  pipes: [MoneyPipe]
})
export class RoundCustomerComponent implements OnInit {
  hover: boolean;
  focused: boolean;
  wasFocused: boolean;

  @Input()
  key: string
  
  @Input()
  model: RoundCustomerModel

  @Output()
  remove = new EventEmitter<boolean>()

  @ViewChild('removeBtn')
  removeBtn: ElementRef;

  @HostListener('mouseleave') 
  mouseleave() {
    this.hover = false;
  }

  get removeKey() {
    return this.key + '-remove';
  }

  constructor(private renderer: Renderer, 
  @Inject(forwardRef(() => EditableService))
  private editableService: EditableService
  ) {
  }

  ngOnInit() {
  }

  removeCustomer(keydown: boolean) {
    this.editableService.startEdit(this.removeKey);
    this.model.remove();
    this.remove.emit(keydown);
  }

  focusRemove() {
    this.renderer.invokeElementMethod(this.removeBtn.nativeElement, 'focus', []);
  }
}