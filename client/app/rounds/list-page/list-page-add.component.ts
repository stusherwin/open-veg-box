import { Component, Input, Output, EventEmitter, ViewChild, forwardRef, Inject, ElementRef, Renderer, ViewChildren, QueryList } from '@angular/core';
import { Round, RoundCustomer } from '../round';
import { HeadingComponent } from '../../shared/heading.component';
import { ROUTER_DIRECTIVES } from '@angular/router-deprecated';
import { ValidatableComponent } from '../../shared/validatable.component';
import { ButtonComponent } from '../../shared/button.component'

@Component({
  selector: 'cc-list-page-add',
  templateUrl: 'app/rounds/list-page/list-page-add.component.html',
  directives: [HeadingComponent, ROUTER_DIRECTIVES, ValidatableComponent, ButtonComponent]
})
export class ListPageAddComponent {
  round = new Round(0, '', 5, []);
  adding: boolean;
  rowFocused: boolean;

  constructor(private renderer: Renderer) {
  }

  @ViewChild('roundName')
  roundName: ElementRef;

  @ViewChild('add')
  addButton: ElementRef;

  @Output()
  add = new EventEmitter<Round>();

  @ViewChildren(ValidatableComponent)
  validatables: QueryList<ValidatableComponent>

  validated = false;
  get valid() {
    return !this.validated
      || !this.validatables
      || !this.validatables.length
      || this.validatables.toArray().every(v => v.valid);
  }

  startAdd() {
    this.adding = true;
    this.validated = false;
    this.round.name = '';

    setTimeout(() => {
      this.renderer.invokeElementMethod(window, 'scrollTo', [0, 0])
      this.renderer.invokeElementMethod(this.roundName.nativeElement, 'focus', [])
    });
  }

  completeAdd() {
    this.validated = true;

    if(this.valid) {
    this.add.emit(this.round);
    this.adding = false;
      this.validated = false;
    } else {
      setTimeout(() => this.renderer.invokeElementMethod(this.roundName.nativeElement, 'focus', []));
    }
  }

  cancelAdd() {
    this.adding = false;
    this.validated = false;
  } 

  onActivate() {
    this.rowFocused = true;
  }

  onDeactivate() {
    if(this.adding) {
      this.adding = false;
    }
    this.rowFocused = false;
  }
}