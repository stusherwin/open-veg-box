import { Component, Input, Output, EventEmitter, ViewChild, forwardRef, Inject, ElementRef, Renderer, ViewChildren, QueryList } from '@angular/core';
import { Product } from './product';
import { HeadingComponent } from '../shared/heading.component';
import { ROUTER_DIRECTIVES } from '@angular/router-deprecated';
import { ActiveElementDirective, ActivateOnFocusDirective } from '../shared/active-elements'
import { ValidatableComponent } from '../shared/validatable.component';

@Component({
  selector: 'cc-product-add',
  templateUrl: 'app/products/product-add.component.html',
  directives: [HeadingComponent, ActiveElementDirective, ActivateOnFocusDirective, ROUTER_DIRECTIVES, ValidatableComponent]
})
export class ProductAddComponent {
  product = new Product(0, '', 1.0, 'perKg', 1.0);
  adding: boolean;
  rowFocused: boolean;

  constructor(private renderer: Renderer) {
  }

  @ViewChild('productName')
  productName: ElementRef;

  @ViewChild('add')
  addButton: ElementRef;

  @ViewChild('active')
  active: ActiveElementDirective;

  @Input()
  index: number;

  @Input()
  showAddMessage: boolean;

  @Input()
  loaded: boolean;

  @Output()
  add = new EventEmitter<Product>();

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
    this.product.name = '';
    setTimeout(() => this.renderer.invokeElementMethod(this.productName.nativeElement, 'focus', []));
  }

  completeAdd() {
    this.validated = true;

    if(this.valid) {
    this.add.emit(this.product);
    this.adding = false;
    this.active.makeInactive();
      this.validated = false;
    } else {
      setTimeout(() => this.renderer.invokeElementMethod(this.productName.nativeElement, 'focus', []));
    }
  }

  cancelAdd() {
    this.adding = false;
    this.active.makeInactive();
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