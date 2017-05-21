import { Component, OnInit, AfterViewInit, Input, ViewChild, ElementRef, ChangeDetectorRef, AfterViewChecked, ViewChildren, QueryList, Renderer } from '@angular/core';
import { DistributeWidthService } from '../shared/distribute-width.directive'
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
import { SectionHeaderComponent } from '../structure/section-header.component'
import { EditableService } from '../shared/editable.service'
import { Arrays } from '../shared/arrays'
import 'rxjs/add/operator/combineLatest';
import 'rxjs/add/observable/combineLatest';

@Component({
  selector: 'cc-boxes-page',
  templateUrl: 'app/boxes/boxes-page.component.html',
  directives: [BoxComponent, BoxAddComponent, SectionHeaderComponent],
  providers: [BoxService, ProductService, UsersService, BoxProductsService, EditableService, DistributeWidthService]
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
    this.boxService.add(box).subscribe(id => {
      this.boxes.unshift(new BoxWithProducts(id, box.name, box.price, []));
    }); 
  }

  onDelete(box: Box) {
    this.boxService.delete(box.id).subscribe(() => {
      Arrays.remove(this.boxes, box);
    });
  }

  onUpdate(box: Box) {
    this.boxService.update(box.id, box).subscribe(() => {});
  }

  onProductAdd(event: BoxProductEvent) {
    this.boxService.addProduct(event.boxId, event.product.id, event.product).subscribe(() => {});
  }

  onProductUpdate(event: BoxProductEvent) {
    this.boxService.updateProduct(event.boxId, event.product.id, event.product).subscribe(() => {});
  }

  onProductRemove(event: BoxProductEvent) {
    this.boxService.removeProduct(event.boxId, event.product.id).subscribe(() => {});
  }
}