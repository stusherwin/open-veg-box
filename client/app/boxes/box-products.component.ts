import { Component, Directive, Input, ViewChild, ElementRef, Output, EventEmitter, ViewChildren, QueryList } from '@angular/core';
import { FocusDirective } from '../shared/focus.directive'
import { BoxProduct } from './box'
import { Subscription } from 'rxjs/Subscription' 
import { Observable } from 'rxjs/Observable';
import { EditableComponent } from '../shared/editable.component'

@Component({
  selector: 'cc-box-products',
  directives: [FocusDirective, EditableComponent],
  templateUrl: 'app/boxes/box-products.component.html'
})
export class BoxProductsComponent {
  tabbedInto: boolean;
  buttonsSubscription: Subscription;

  @Input()
  editTabindex: number;

  @Input()
  value: BoxProduct[];
  
  @Output()
  valueChange = new EventEmitter<BoxProduct[]>();

  @Input()
  products: BoxProduct[];

  @Output()
  add = new EventEmitter<number>();

  @Output()
  remove = new EventEmitter<number>();

  @ViewChildren('button')
  buttons: QueryList<FocusDirective>

  onEditStart(tabbedInto: boolean) {
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
      this.products.push(product);
      this.products.sort((a,b) => a.name < b.name? -1 : 1);
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
    let product = this.products.find(p => p.id == productId);
    if(product) {
      let index = this.products.findIndex(p => p.id == productId);
      this.value.push(product);
      this.products.splice(index, 1);
      this.add.emit(product.id);
     
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