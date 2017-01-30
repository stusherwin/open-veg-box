import { Component, Directive, Input, ViewChild, ElementRef, Output, EventEmitter, ViewChildren, QueryList, AfterViewInit, ChangeDetectorRef, AfterViewChecked, OnChanges, Inject, forwardRef, OnInit, OnDestroy, Renderer } from '@angular/core';
import { MutuallyExclusiveEditService, MutuallyExclusiveEditComponent } from './mutually-exclusive-edit.service'

@Component({
  selector: 'cc-box-product-remove',
  templateUrl: 'app/boxes/box-product-remove.component.html'
})
export class BoxProductRemoveComponent implements MutuallyExclusiveEditComponent, OnInit, AfterViewInit {
  @Input()
  editId: string;

  @ViewChild('remove')
  removeBtn: ElementRef

  @Output()
  remove = new EventEmitter<boolean>();

  constructor(
    @Inject(forwardRef(() => MutuallyExclusiveEditService))
    private mutexService: MutuallyExclusiveEditService,
    private renderer: Renderer) {
  }

  ngOnInit() {
    if(this.mutexService.isAnyEditingWithPrefix(this.editId)) {
      this.mutexService.startEdit(this);
    }
  }

  ngAfterViewInit() {
    if(this.mutexService.isEditing(this)) {
      this.renderer.invokeElementMethod(this.removeBtn.nativeElement, 'focus', []);
    }
  }

  onRemoveFocus() {
    this.mutexService.startEdit(this);
  }

  onRemoveClick(keyboard: boolean) {
    this.remove.emit(keyboard);
  }

  endEdit() {
  }

  onKeyDown(event: KeyboardEvent) {
    if(event.key == 'Enter') {
      this.onRemoveClick(true);
    }
  }

  focus() {
    this.renderer.invokeElementMethod(this.removeBtn.nativeElement, 'focus', []);
  }
}