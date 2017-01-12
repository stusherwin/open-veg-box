import { Component, Directive, Input, ViewChild, ElementRef, Output, EventEmitter, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { FocusDirective } from '../shared/focus.directive'
import { BoxProduct } from './box'
import { Subscription } from 'rxjs/Subscription' 
import { Observable } from 'rxjs/Observable';
import { EditableComponent } from '../shared/editable.component'
import { Arrays } from '../shared/arrays'
import { QuantityPipe } from '../shared/pipes'

@Component({
  selector: 'cc-box-products',
  directives: [FocusDirective, EditableComponent],
  pipes: [QuantityPipe],
  templateUrl: 'app/boxes/box-products.component.html'
})
export class BoxProductsComponent implements AfterViewInit {
  tabbedInto: boolean;
  buttonsSubscription: Subscription;
  unusedProducts: BoxProduct[] = [];

  @Input()
  editTabindex: number;

  @Input()
  value: BoxProduct[];
  
  @Output()
  valueChange = new EventEmitter<BoxProduct[]>();

  @Input()
  products: BoxProduct[];

  @Output()
  add = new EventEmitter<any>();

  @Output()
  remove = new EventEmitter<number>();

  @ViewChildren('button')
  buttons: QueryList<FocusDirective>

  ngAfterViewInit() {
    
  }

  onEditStart(tabbedInto: boolean) {
    this.unusedProducts = this.products.filter(p => !this.value.find(v => v.id == p.id));
    this.unusedProducts.sort((a,b) => a.name < b.name? -1 : 1);

    this.tabbedInto = tabbedInto;
    if(tabbedInto) {
      if(this.buttons.length) {
        this.buttons.first.beFocused();
      }
      this.buttonsSubscription = this.buttons.changes.subscribe((buttons: QueryList<FocusDirective>) => {
        if(buttons.length) {
          buttons.first.beFocused();
        } 
      });
    }
  }

  onEditEnd(success: boolean) {
    if(this.buttonsSubscription) {
      this.buttonsSubscription.unsubscribe();
    }
  }

  removeProductClick(productId: number) {
    let index = this.value.findIndex(p => p.id == productId);
    if(index >= 0) {
      let product = this.value.find(p => p.id == productId);
      this.value.splice(index, 1);
      this.unusedProducts.push(product);
      this.unusedProducts.sort((a,b) => a.name < b.name? -1 : 1);
      this.remove.emit(productId);
     
      if(this.tabbedInto) {
        setTimeout(() => {
          if(this.buttons.length) {
            this.buttons.first.beFocused();
          }
        });
      }
    }
  }

  addProductClick(productId: number ) {
    let product = this.unusedProducts.find(p => p.id == productId);
    if(product) {
      let index = this.unusedProducts.findIndex(p => p.id == productId);
      this.value.push(product);
      this.unusedProducts.splice(index, 1);
      this.add.emit({productId: product.id, quantity: product.quantity});
     
      if(this.tabbedInto) {
        setTimeout(() => {
          if(this.buttons.length) {
            this.buttons.first.beFocused();
          }
        });
      }
    }
  }
}