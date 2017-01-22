import { Component, OnInit, AfterViewInit, Input, ViewChild, ElementRef, ChangeDetectorRef, AfterViewChecked, ViewChildren, QueryList } from '@angular/core';
import { Box, BoxProduct } from './box'
import { Product } from '../products/product';
import { BoxService } from './box.service'
import { ProductService } from '../products/product.service'
import { UsersService } from '../users/users.service'
import { BoxComponent } from './box.component'
import { Observable } from 'rxjs/Observable';
import { RouteParams } from '@angular/router-deprecated';
import { FocusService } from '../shared/focus.service';
import { FocusDirective } from '../shared/focus.directive';
import { WeightPipe } from '../shared/pipes';
import 'rxjs/add/operator/combineLatest';

@Component({
  selector: 'cc-boxes',
  templateUrl: 'app/boxes/boxes.component.html',
  directives: [BoxComponent, FocusDirective],
  providers: [BoxService, ProductService, UsersService, FocusService]
})
export class BoxesComponent implements OnInit, AfterViewChecked {
  constructor(private boxService: BoxService, private productService: ProductService, private routeParams: RouteParams, private changeDetector: ChangeDetectorRef) {
    this.queryParams = routeParams.params;
  }

  boxes: Box[] = [];
  products: BoxProduct[] = [];
  loaded: boolean;
  productNames: string[] = [];
  productQuantities: string[] = [];
  availableProductNames: string[] = [];
  productNameWidth: number = 0;
  productQuantityWidth: number = 0;

  queryParams: {[key: string]: string};

  @ViewChildren('productNameTest')
  productNameTests: QueryList<ElementRef>

  @ViewChildren('productQuantityTest')
  productQuantityTests: QueryList<ElementRef>

  ngOnInit() {
    let weight = new WeightPipe();

    this.boxService.getAll(this.queryParams)
      .combineLatest(this.productService.getAll(this.queryParams), (boxes, products) => ({ boxes, products }))
      .subscribe(({boxes, products}) => {
        this.loaded = true;
        this.boxes = boxes;

        this.boxes.forEach(b => b.products.forEach(p => {
          let q = p.unitType == 'perKg' ? weight.transform(p.quantity) : '' + p.quantity;
        
          if(!this.productQuantities.find(pq => pq == q)) {
            this.productQuantities.push(q);
          }
        }));
        
        this.products = products.map(p => new BoxProduct(p.id, p.name, 1, p.unitType));
        
        this.products.forEach(p => {
          if(!this.productNames.find(pn => pn == p.name)) {
            this.productNames.push(p.name);
          }
        });

        this.availableProductNames = this.products
          .filter(p => !this.boxes.every(b => !!b.products.find(bp => bp.id == p.id)))
          .map(p => p.name);
      } );
  }

  ngAfterViewChecked() {
    let newNameWidth = Math.floor(this.productNameTests.reduce((max, i) => Math.max(max, i.nativeElement.getBoundingClientRect().width), 0));
    let newQuantityWidth = Math.floor(this.productQuantityTests.reduce((max, i) => Math.max(max, i.nativeElement.getBoundingClientRect().width), 0));
    if(this.productNameWidth != newNameWidth || newQuantityWidth != this.productQuantityWidth) {
      this.productNameWidth = newNameWidth;
      this.productQuantityWidth = newQuantityWidth;
      
      this.changeDetector.detectChanges();
    }
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