import { Component, OnInit, AfterViewInit, Input, ViewChild, ElementRef, ChangeDetectorRef, AfterViewChecked, ViewChildren, QueryList, Renderer } from '@angular/core';
import { Box, BoxWithProducts } from './box'
import { Product, ProductQuantity } from '../products/product';
import { BoxService } from './box.service'
import { ProductService } from '../products/product.service'
import { UsersService } from '../users/users.service'
import { BoxComponent, BoxProductEvent } from './box.component'
import { BoxAddComponent } from './box-add.component'
import { Observable } from 'rxjs/Observable';
import { RouteParams } from '@angular/router-deprecated';
import { BoxProductsService } from './box-products.service';
import { ActiveService, ActiveElementDirective, ActivateOnFocusDirective, DeactivateOnBlurDirective } from '../shared/active-elements'
import { SectionHeaderComponent } from '../structure/section-header.component'
import 'rxjs/add/operator/combineLatest';

@Component({
  selector: 'cc-boxes-page',
  templateUrl: 'app/boxes/boxes-page.component.html',
  directives: [BoxComponent, ActiveElementDirective, BoxAddComponent, ActivateOnFocusDirective, DeactivateOnBlurDirective, SectionHeaderComponent],
  providers: [BoxService, ProductService, UsersService, BoxProductsService, ActiveService]
})
export class BoxesPageComponent implements OnInit {
  constructor(private boxService: BoxService, private productService: ProductService, private routeParams: RouteParams, private changeDetector: ChangeDetectorRef, private renderer: Renderer) {
    this.queryParams = routeParams.params;
  }

  boxes: BoxWithProducts[] = [];
  products: Product[] = [];
  loaded: boolean;
  queryParams: {[key: string]: string};

  ngOnInit() {
    this.boxService.getAllWithProducts(this.queryParams)
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
      setTimeout(() => this.renderer.invokeElementMethod(window, 'scrollTo', [0, document.body.scrollHeight]));
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