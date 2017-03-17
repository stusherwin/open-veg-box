import { Component, Directive, Input, ViewChild, ElementRef, Output, EventEmitter, ViewChildren, QueryList, AfterViewInit, ChangeDetectorRef, AfterViewChecked, Inject, forwardRef, OnInit, OnDestroy, Renderer, OnChanges } from '@angular/core';
import { RoundCustomer } from './round'
import { Customer } from '../customers/customer'
import { Subscription } from 'rxjs/Subscription'
import { Observable } from 'rxjs/Observable';
import { ActiveElementDirective, ActiveService, ActivateOnFocusDirective, DeactivateOnBlurDirective } from '../shared/active-elements';
import { EditableValueComponent } from '../shared/editable-value.component'
import { Arrays } from '../shared/arrays'
import { DefaultToPipe } from '../shared/pipes'

@Component({
  selector: 'cc-round-customer-add',
  templateUrl: 'app/rounds/round-customer-add.component.html',
  directives: [ActiveElementDirective, ActivateOnFocusDirective, DeactivateOnBlurDirective, EditableValueComponent],
  pipes: [DefaultToPipe]
})
export class RoundCustomerAddComponent implements OnInit, OnChanges {
  adding: boolean;
  addHover: boolean;
  customer: Customer;
  
  @Input()
  customers: Customer[];

  @Input()
  tabindex: number;

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

  @ViewChild('editable')
  editable: EditableValueComponent  

  @Output()
  add = new EventEmitter<Customer>();

  constructor(
    private renderer: Renderer,
    private changeDetector: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.customer = this.customers[0];
  }

  ngOnChanges() {
    // urgh. how to respond to changes in input properties?
    // Wish I had written this in React.
    this.customer = this.customers[0];
  }

  onStart() {
    this.customer = this.customers[0];
    this.adding = true;

    let subscription = this.select.changes.subscribe((f: QueryList<ElementRef>) => {
      if(f.length && this.adding) {
        this.renderer.invokeElementMethod(f.first.nativeElement, 'focus', []);
        subscription.unsubscribe();
      }
    })
  }

  onCustomerChange(event: any) {
    this.customer = this.customers[+event.target.value];
  }

  onAdd() {
    this.editable.startEdit();
  }

  onOk(tabbedAway: boolean) {
    if(tabbedAway && this.customers.length > 1) {
      setTimeout(() => this.renderer.invokeElementMethod(this.addBtn.nativeElement, 'focus', []))
    } 
    
    this.add.emit(this.customer);
    
    Arrays.remove(this.customers, this.customer);
    this.editable.endEdit();
    this.adding = false;
  }

  onCancel() {
    this.customer = this.customers[0];
    this.editable.endEdit();
    this.adding = false;
 }
  
  focus() {
    this.renderer.invokeElementMethod(this.addBtn.nativeElement, 'focus', [])
  }
}