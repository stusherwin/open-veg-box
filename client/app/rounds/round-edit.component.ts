import { Component, Input, Output, EventEmitter, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Round } from './round';

@Component({
  selector: 'cc-round-edit',
  templateUrl: 'app/rounds/round-edit.component.html',
})
export class RoundEditComponent implements AfterViewInit {
  @Input()
  round: Round;

  @Output()
  onSave = new EventEmitter<Round>();

  @Output()
  onCancel = new EventEmitter();

  @ViewChild('name')
  name: ElementRef;

  ngAfterViewInit() {
    this.name.nativeElement.focus();
  }

  cancel() {
    this.onCancel.emit({});
  }

  save() {
    this.onSave.emit(this.round);
  }
}