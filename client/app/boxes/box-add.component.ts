import { Component, Input, Output, EventEmitter, ViewChild, forwardRef, Inject, ElementRef, Renderer, ViewChildren, QueryList } from '@angular/core';
import { Box } from './box';
import { Product, ProductQuantity } from '../products/product'
import { WeightPipe, MoneyPipe } from '../shared/pipes';
import { HeadingComponent } from '../shared/heading.component';
import { BoxPriceComponent } from './box-price.component';
import { BoxProductsComponent } from './box-products.component';
import { ActiveElementDirective, ActivateOnFocusDirective, DeactivateOnBlurDirective } from '../shared/active-elements'
import { ValidatableComponent } from '../shared/validatable.component';
import { NumericDirective } from '../shared/numeric.directive'

@Component({
  selector: 'cc-box-add',
  templateUrl: 'app/boxes/box-add.component.html',
  directives: [HeadingComponent, BoxPriceComponent, BoxProductsComponent, ActiveElementDirective, ActivateOnFocusDirective, DeactivateOnBlurDirective, ValidatableComponent, NumericDirective]
})
export class BoxAddComponent {
  box = new Box(0, '', 10.0);
  adding: boolean;
  rowFocused: boolean;

  constructor(private renderer: Renderer) {
  }

  @ViewChild('boxName')
  boxName: ElementRef;

  @ViewChild('add')
  addButton: ElementRef;

  @ViewChild('active')
  active: ActiveElementDirective;

  @Output()
  add = new EventEmitter<Box>();

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
    this.box.name = '';
    this.box.price = 10.0;
    
    setTimeout(() => {
      this.renderer.invokeElementMethod(window, 'scrollTo', [0, 0])
      this.renderer.invokeElementMethod(this.boxName.nativeElement, 'focus', [])
    });
  }

  completeAdd() {
    this.validated = true;

    if(this.valid) {
      this.add.emit(this.box);
      this.adding = false;
      this.active.makeInactive();
      this.validated = false;
    } else {
      setTimeout(() => this.renderer.invokeElementMethod(this.boxName.nativeElement, 'focus', []));
    }
  }

  cancelAdd() {
    this.adding = false;
    this.box = new Box(0, 'New box', 10.0);
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