import { Component, OnInit, AfterViewInit, Input, ViewChild, ElementRef, ChangeDetectorRef, AfterViewChecked, ViewChildren, QueryList } from '@angular/core';
import { Box, BoxProduct } from './box'
import { Product } from '../products/product';
import { BoxService } from './box.service'
import { ProductService } from '../products/product.service'
import { UsersService } from '../users/users.service'
import { BoxComponent, BoxProductEvent } from './box.component'
import { Observable } from 'rxjs/Observable';
import { RouteParams } from '@angular/router-deprecated';
import { FocusService } from '../shared/focus.service';
import { FocusDirective } from '../shared/focus.directive';
import { BoxProductsService } from './box-products.service';
import 'rxjs/add/operator/combineLatest';

@Component({
  selector: 'cc-boxes',
  templateUrl: 'app/boxes/boxes.component.html',
  directives: [BoxComponent, FocusDirective],
  providers: [BoxService, ProductService, UsersService, FocusService, BoxProductsService]
})
export class BoxesComponent implements OnInit {
  constructor(private boxService: BoxService, private productService: ProductService, private routeParams: RouteParams, private changeDetector: ChangeDetectorRef) {
    this.queryParams = routeParams.params;
  }

  boxes: Box[] = [];
  products: BoxProduct[] = [];
  loaded: boolean;
  queryParams: {[key: string]: string};

  ngOnInit() {
    this.boxService.getAll(this.queryParams)
      .combineLatest(this.productService.getAll(this.queryParams), (boxes, products) => ({ boxes, products }))
      .subscribe(({boxes, products}) => {
        this.loaded = true;
        this.boxes = boxes;
        this.products = products.map(p => new BoxProduct(p.id, p.name, 1, p.unitType));
      });
  }

  onAdd(box: Box) {
    this.boxService.add(box, this.queryParams).subscribe(boxes => {
      this.boxes = boxes;
    });
  }

  onDelete(box: Box) {
    this.boxService.delete(box.id, this.queryParams).subscribe(boxes => {
      this.boxes = boxes;
    });
  }

  onUpdate(box: Box) {
    this.boxService.update(box.id, box, this.queryParams).subscribe(boxes => {});
  }

  onProductAdd(event: BoxProductEvent) {
    this.boxService.addProduct(event.boxId, event.product.id, event.product, this.queryParams).subscribe(boxes => {
    });
  }

  onProductUpdate(event: BoxProductEvent) {
    this.boxService.updateProduct(event.boxId, event.product.id, event.product, this.queryParams).subscribe(boxes => {
    });
  }

  onProductRemove(event: BoxProductEvent) {
    this.boxService.removeProduct(event.boxId, event.product.id, this.queryParams).subscribe(boxes => {
    });
  }
}