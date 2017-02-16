import { Component, OnInit, AfterViewInit, Input, ViewChild, ElementRef, ChangeDetectorRef, AfterViewChecked, ViewChildren, QueryList } from '@angular/core';
import { Box, BoxProduct } from './box'
import { Product } from '../products/product';
import { BoxService } from './box.service'
import { ProductService } from '../products/product.service'
import { UsersService } from '../users/users.service'
import { BoxComponent, BoxProductEvent } from './box.component'
import { BoxAddComponent } from './box-add.component'
import { Observable } from 'rxjs/Observable';
import { RouteParams } from '@angular/router-deprecated';
import { BoxProductsService } from './box-products.service';
import { ActiveService, ActiveElementDirective } from '../shared/active-elements'
import 'rxjs/add/operator/combineLatest';

@Component({
  selector: 'cc-boxes',
  templateUrl: 'app/boxes/boxes.component.html',
  directives: [BoxComponent, ActiveElementDirective, BoxAddComponent],
  providers: [BoxService, ProductService, UsersService, BoxProductsService, ActiveService]
})
export class BoxesComponent implements OnInit {
  constructor(private boxService: BoxService, private productService: ProductService, private routeParams: RouteParams, private changeDetector: ChangeDetectorRef) {
    this.queryParams = routeParams.params;
  }

  boxes: Box[] = [];
  products: Product[] = [];
  loaded: boolean;
  queryParams: {[key: string]: string};

  ngOnInit() {
    this.boxService.getAll(this.queryParams)
      .combineLatest(this.productService.getAll(this.queryParams), (boxes, products) => ({ boxes, products }))
      .subscribe(({boxes, products}) => {
        this.loaded = true;
        this.boxes = boxes;
        this.products = products;
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