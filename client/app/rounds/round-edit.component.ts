import { Component, Input, Output, EventEmitter, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Round, RoundCustomer } from './round';

@Component({
  selector: 'cc-round-edit',
  templateUrl: 'app/rounds/round-edit.component.html',
})
export class RoundEditComponent implements AfterViewInit {
  @Input()
  round: Round;

  @Input()
  customers: RoundCustomer[];

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

  isOnRound(customer: RoundCustomer) {
    return this.round.customers.map(c => c.id).indexOf(customer.id) >= 0;
  }

  setOnRound(customer: RoundCustomer, evt: any) {
    if( evt.target.checked ) {
      this.round.customers.push(customer);
    } else {
      let index = this.round.customers.findIndex( c => c.id == customer.id);
      console.log(index);
      if(index >= 0) {
        this.round.customers.splice(index, 1);
      }
    }
  }
}