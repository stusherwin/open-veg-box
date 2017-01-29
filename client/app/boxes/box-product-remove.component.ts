import { Component, Directive, Input, ViewChild, ElementRef, Output, EventEmitter, ViewChildren, QueryList, AfterViewInit, ChangeDetectorRef, AfterViewChecked, OnChanges, Inject, forwardRef, OnInit, OnDestroy, Renderer } from '@angular/core';
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

  //@ViewChild('focusable')
  //focusable: FocusDirective;
  @ViewChild('remove')
  removeBtn: ElementRef

  @Output()
  remove = new EventEmitter<any>();

  constructor(
    @Inject(forwardRef(() => MutuallyExclusiveEditService))
    private mutexService: MutuallyExclusiveEditService,
    private renderer: Renderer) {
  }

  ngOnInit() {
    if(this.mutexService.isAnyEditingWithPrefix(this.editId)) {
      console.log('remove editing');
      this.mutexService.startEdit(this);
      this.editing = true;
    }
  }

  ngAfterViewInit() {
    if(this.editing) {
      this.renderer.invokeElementMethod(this.removeBtn.nativeElement, 'focus', []);
    }
  }

  onEditClick() {
    this.mutexService.startEdit(this);
    this.editing = true;
    this.renderer.invokeElementMethod(this.removeBtn.nativeElement, 'focus', []);
  }

  onRemoveClick() {
    this.editing = false;
    this.remove.emit(null);
  }

  endEdit() {
    this.editing = false;
    //this.onEditOkClick();
  }

  onKeyDown(event: KeyboardEvent) {
    if(event.key == 'Enter') {
      this.onRemoveClick();
    }
  }

  onRemoveFocus() {
    this.mutexService.startEdit(this);
    this.editing = true;
    //console.log('remove focus')
  }

  onRemoveBlur() {
    //console.log('remove blur')
    //this.mutexService.endEdit(this);
    // this.editing = false;
  }

  onHiddenFocus() {
    console.log('hiddenfocus')
    this.renderer.invokeElementMethod(this.removeBtn.nativeElement, 'focus', []);
  }
}