import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Round } from './round';
import { SingleLinePipe } from '../shared/pipes';

@Component({
  selector: 'cc-round-display',
  templateUrl: 'app/rounds/round-display.component.html',
  pipes: [SingleLinePipe]
})
export class RoundDisplayComponent {
  @Input()
  round: Round;

  @Input()
  editDisabled: boolean;

  @Output()
  onEdit = new EventEmitter<Round>();

  @Output()
  onDelete = new EventEmitter<Round>();

  edit() {
    this.onEdit.emit(this.round);
  } 

  delete() {
    this.onDelete.emit(this.round);
  } 

  clickEmail(event:any) {
    if(this.editDisabled) { event.preventDefault(); return false;} return true;
  }
}