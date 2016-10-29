// import { Component, Input, Output, EventEmitter } from '@angular/core';
// import { Round } from './round';
// import { SingleLinePipe } from '../shared/pipes';
// import { HeadingComponent } from '../shared/heading.component';

// @Component({
//   selector: 'cc-round-display',
//   templateUrl: 'app/rounds/round-display.component.html',
//   pipes: [SingleLinePipe],
//   directives: [HeadingComponent]
// })
// export class RoundDisplayComponent {
//   @Input()
//   round: Round;

//   @Input()
//   editDisabled: boolean;

//   @Output()
//   onEdit = new EventEmitter<Round>();

//   @Output()
//   onDelete = new EventEmitter<Round>();

//   edit() {
//     this.onEdit.emit(this.round);
//   } 

//   delete() {
//     this.onDelete.emit(this.round);
//   } 

//   clickEmail(event:any) {
//     if(this.editDisabled) { event.preventDefault(); return false;} return true;
//   }
// }

import { Component, Input, Output, EventEmitter, ViewChild, forwardRef, Inject } from '@angular/core';
import { Round, RoundCustomer } from './round';
import { HeadingComponent } from '../shared/heading.component';
import { FocusDirective } from '../shared/focus.directive'
import { HighlightableDirective } from '../shared/highlightable.directive'
import { RoundCustomersComponent } from './round-customers.component';

@Component({
  selector: 'cc-round-display',
  templateUrl: 'app/rounds/round-display.component.html',
  directives: [HeadingComponent, FocusDirective, HighlightableDirective, RoundCustomersComponent]
})
export class RoundDisplayComponent {
  adding: boolean;
  focusedChild: any;
  focused: boolean;

  constructor() {
    this.round = new Round(0, 'New round', []);
  }

  @ViewChild('roundName')
  roundName: HeadingComponent;

  @ViewChild('addButton')
  addButton: FocusDirective;

  @ViewChild('row')
  row: HighlightableDirective;

  @Input()
  addMode: boolean;

  @Input()
  round: Round;

  @Input()
  editDisabled: boolean;

  @Input()
  index: number;

  @Input()
  showAddMessage: boolean;

  @Input()
  customers: RoundCustomer[];


  @Output()
  onDelete = new EventEmitter<Round>();

  @Output()
  onSave = new EventEmitter<Round>();

  startAdd() {
    this.adding = true;
    this.roundName.startEdit();
  }

  completeAdd() {
    this.onSave.emit(this.round);
    this.adding = false;
    this.round = new Round(0, 'New round', []);

    this.startAdd();
  }

  delete() {
    this.onDelete.emit(this.round);
  }

  cancelAdd() {
    this.adding = false;
    this.round = new Round(0, 'New round', []);

    this.addButton.focus();
  } 

  blur(evnt: any) {
    if(this.focusedChild && this.focusedChild == evnt.srcElement){
      this.focusedChild = null;
    }

    setTimeout(() => {
      if(!this.focusedChild) {
        if(this.adding) {
          this.adding = false;
          this.round = new Round(0, 'New product', []);
        }
        this.focused = false;
      }
    }, 100);
  }

  focus(evnt: any) {
    if(!this.focused) {
      if(this.addMode) {
        this.startAdd();
      }
    }
    
    this.focusedChild = evnt.srcElement;
    this.focused = true;
  }
  
  clickEmail(event:any) {
    if(this.editDisabled) { event.preventDefault(); return false;} return true;
  }
}