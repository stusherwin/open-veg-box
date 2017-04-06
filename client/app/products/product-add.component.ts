import { Component, Input, Output, EventEmitter, ViewChild, forwardRef, Inject, ElementRef, Renderer, ViewChildren, QueryList } from '@angular/core';
import { Product, UnitType, unitTypes } from './product';
import { HeadingComponent } from '../shared/heading.component';
import { ROUTER_DIRECTIVES } from '@angular/router-deprecated';
import { ActiveElementDirective, ActivateOnFocusDirective, DeactivateOnBlurDirective } from '../shared/active-elements'
import { ValidatableComponent } from '../shared/validatable.component';
import { NumericDirective } from '../shared/numeric.directive'

@Component({
  selector: 'cc-product-add',
  templateUrl: 'app/products/product-add.component.html',
  directives: [HeadingComponent, ActiveElementDirective, ActivateOnFocusDirective, DeactivateOnBlurDirective, ROUTER_DIRECTIVES, ValidatableComponent, NumericDirective]
})
export class ProductAddComponent {
  unitTypes: UnitType[] = unitTypes;
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
    this.validated = false;
    this.product.name = '';
    this.product.price = 1.0;
    this.product.unitType = 'perKg';
    setTimeout(() => {
      this.renderer.invokeElementMethod(window, 'scrollTo', [0, 0])
      this.renderer.invokeElementMethod(this.productName.nativeElement, 'focus', [])
    })
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