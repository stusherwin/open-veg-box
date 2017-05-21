import { Component, OnInit, Input, Renderer } from '@angular/core';
import { Product } from './product'
import { ProductService } from './product.service'
import { UsersService } from '../users/users.service'
import { ProductComponent } from './product.component'
import { ProductAddComponent } from './product-add.component'
import { Observable } from 'rxjs/Observable';
import { RouteParams } from '@angular/router-deprecated';
import { SectionHeaderComponent } from '../structure/section-header.component'
import { EditableService } from '../shared/editable.service'

@Component({
  selector: 'cc-products-page',
  templateUrl: 'app/products/products-page.component.html',
  directives: [ProductComponent, ProductAddComponent, SectionHeaderComponent],
  providers: [ProductService, UsersService, EditableService]
})
export class ProductsPageComponent implements OnInit {
  constructor(productService: ProductService, routeParams: RouteParams, private renderer: Renderer) {
    this.productService = productService;
    this.queryParams = routeParams.params;
  }

  productService: ProductService;
  products: Product[] = [];
  loaded: boolean;

  queryParams: {[key: string]: string};

  ngOnInit() {
    this.productService.getAll(this.queryParams).subscribe(p => {
      this.loaded = true;
      this.products = p;
    } );
  }

  onAdd(product: Product) {
    this.productService.add({name: product.name, price: product.unitPrice.price, unitType: product.unitPrice.unitType, unitQuantity: 1}, this.queryParams).subscribe(products => {
      this.products = products;
      setTimeout(() => this.renderer.invokeElementMethod(window, 'scrollTo', [0, document.body.scrollHeight]));
    });
  }

  onDelete(product: Product) {
    this.productService.delete(product.id, this.queryParams).subscribe(products => {
      this.products = products;
    });
  }

  onUpdate(product: Product) {
    this.productService.update(product.id, {price: product.unitPrice.price, unitType: product.unitPrice.unitType}, this.queryParams).subscribe(products => {});
  }
}