import { Component, OnInit, Input } from '@angular/core';
import { Box, BoxProduct } from './box'
import { BoxService } from './box.service'
import { ProductService } from '../products/product.service'
import { UsersService } from '../users/users.service'
import { BoxComponent } from './box.component'
import { Observable } from 'rxjs/Observable';
import { RouteParams } from '@angular/router-deprecated';
import { FocusService } from '../shared/focus.service';
import { FocusDirective } from '../shared/focus.directive';

@Component({
  selector: 'cc-boxes',
  templateUrl: 'app/boxes/boxes.component.html',
  directives: [BoxComponent, FocusDirective],
  providers: [BoxService, ProductService, UsersService, FocusService]
})
export class BoxesComponent implements OnInit {
  constructor(private boxService: BoxService, private productService: ProductService, routeParams: RouteParams) {
    this.queryParams = routeParams.params;
  }

  boxes: Box[] = [];
  products: BoxProduct[] = [];
  loaded: boolean;

  queryParams: {[key: string]: string};

  ngOnInit() {
    this.boxService.getAll(this.queryParams).subscribe(b => {
      this.loaded = true;
      this.boxes = b;
    } );

    this.productService.getAll(this.queryParams).subscribe(products => {
      this.products = products.map(p => new BoxProduct(p.id, p.name, 1, p.unitType));
    } );
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

  onProductAdd(event: any) {
    this.boxService.addProduct(event.boxId, event.productId, event, this.queryParams).subscribe(boxes => {
    });
  }

  onProductRemove(event: any) {
    this.boxService.removeProduct(event.boxId, event.productId, this.queryParams).subscribe(boxes => {
    });
  }
}