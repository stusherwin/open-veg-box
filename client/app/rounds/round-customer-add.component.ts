import { Component, Directive, Input, ViewChild, ElementRef, Output, EventEmitter, ViewChildren, QueryList, AfterViewInit, ChangeDetectorRef, AfterViewChecked, OnChanges, Inject, forwardRef, OnInit, OnDestroy, Renderer } from '@angular/core';
import { RoundCustomer } from './round'
import { Customer } from '../customers/customer'
import { Subscription } from 'rxjs/Subscription'
import { Observable } from 'rxjs/Observable';
import { MutuallyExclusiveEditService, MutuallyExclusiveEditComponent } from '../boxes/mutually-exclusive-edit.service'

@Component({
  selector: 'cc-round-customer-add',
  templateUrl: 'app/rounds/round-customer-add.component.html'
})
export class RoundCustomerAddComponent implements OnInit, AfterViewInit, MutuallyExclusiveEditComponent {
  adding: boolean;
  addHover: boolean;
  customer: Customer;
  
  @Input()
  customers: Customer[];

  @Input()
  editId: string;

  @Input()
  editTabindex: number;

  @Input()
  customerNameWidth: number;

  @Input()
  customerAddressWidth: number;

  @Input()
  text: string;

  @ViewChildren('select')
  select: QueryList<ElementRef>

  @ViewChild('add')
  addBtn: ElementRef  

  @Output()
  add = new EventEmitter<RoundCustomer>();

  constructor(
    @Inject(forwardRef(() => MutuallyExclusiveEditService))
    private mutexService: MutuallyExclusiveEditService,
    private renderer: Renderer) {
  }

  ngOnInit() {
    if(this.mutexService.isAnyEditingWithPrefix(this.editId)) {
      this.mutexService.startEdit(this);
      this.customer = this.customers[0];
      this.adding = true;
    }
  }

  ngAfterViewInit() {
    if(this.select.length && this.adding) {
      this.renderer.invokeElementMethod(this.select.first.nativeElement, 'focus', []);
    }
  }

  onAddClick() {
    this.mutexService.startEdit(this);
    this.customer = this.customers[0];
    this.adding = true;

    let subscription = this.select.changes.subscribe((f: QueryList<ElementRef>) => {
      if(f.length && this.adding) {
        this.renderer.invokeElementMethod(f.first.nativeElement, 'focus', []);
        subscription.unsubscribe();
      }
    })
  }

  onAddCustomerChange(event: any) {
    this.customer = this.customers[+event.target.value];
  }

  onAddOkClick() {
    this.add.emit(new RoundCustomer(this.customer.id, this.customer.name, this.customer.address, this.customer.email));

    this.adding = false;
    this.mutexService.endEdit(this);
  }

  onAddCancelClick() {
    this.adding = false;
    this.mutexService.endEdit(this);
  }

  endEdit() {
    if(this.adding) {
      this.onAddOkClick();
    }
  }

  onAddFocus() {
    this.addHover = true
    this.mutexService.startEdit(this);
  }

  onAddBlur() {
    this.addHover = false
  }

  focus() {
    this.renderer.invokeElementMethod(this.addBtn.nativeElement, 'focus', []);
  }

  onAfterAddFocus() {
    this.onAddOkClick();
    //console.log('afterAddFocus');
    //this.adding = false;
    //this.mutexService.endEdit(this);
  }
 
  keydown(event: KeyboardEvent) {
    if(!this.adding) {
      if(event.key == 'Enter') {
        this.onAddClick();
      }
    } else {
      if(event.key == 'Enter') {
        this.onAddOkClick();
      } else if(event.key == 'Escape') {
        this.onAddCancelClick();
      }
    }
  }
}