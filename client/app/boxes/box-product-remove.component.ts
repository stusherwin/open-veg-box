import { Component, Directive, Input, ViewChild, ElementRef, Output, EventEmitter, ViewChildren, QueryList, AfterViewInit, ChangeDetectorRef, AfterViewChecked, OnChanges, Inject, forwardRef, OnInit, OnDestroy } from '@angular/core';
import { FocusDirective } from '../shared/focus.directive'
import { BoxProduct } from './box'
import { WeightPipe } from '../shared/pipes'
import { Arrays } from '../shared/arrays'
import { MutuallyExclusiveEditService, MutuallyExclusiveEditComponent } from './mutually-exclusive-edit.service'
import { Subscription } from 'rxjs/Subscription'

@Component({
  selector: 'cc-box-product-remove',
  directives: [FocusDirective],
  templateUrl: 'app/boxes/box-product-remove.component.html'
})
export class BoxProductRemoveComponent implements MutuallyExclusiveEditComponent, OnInit, AfterViewInit {
  editing: boolean;

  @Input()
  editId: string;

  @ViewChild('focusable')
  focusable: FocusDirective;

  @Output()
  remove = new EventEmitter<any>();

  constructor(
    @Inject(forwardRef(() => MutuallyExclusiveEditService))
    private mutexService: MutuallyExclusiveEditService) {
  }

  ngOnInit() {
    console.log('any editing(' + this.editId + '): ' + this.mutexService.isAnyEditingWithPrefix(this.editId));
    if(this.mutexService.isAnyEditingWithPrefix(this.editId)) {
      this.mutexService.startEdit(this);
      this.editing = true;
    }
  }

  ngAfterViewInit() {
    if(this.editing) {
      this.focusable.beFocused();
    }
  }

  onEditClick() {
    this.mutexService.startEdit(this);
    this.editing = true;
    this.focusable.beFocused();
  }

  onRemoveClick() {
    this.editing = false;
    this.remove.emit(null);
  }

  endEdit() {
    console.log('remove endEdit');
    //this.onEditOkClick();
  }

  onKeyDown(event: KeyboardEvent) {
    //console.log('key down')
    if(event.key == 'Enter') {
      this.onRemoveClick();
    }
  }

  onRemoveFocus() {
    this.mutexService.startEdit(this);
    //console.log('remove focus')
  }

  onRemoveBlur() {
    //console.log('remove blur')
  }
}