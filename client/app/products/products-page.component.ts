import { Component, OnInit, Input, Renderer } from '@angular/core';
import { Product } from './product'
import { ProductService } from './product.service'
import { UsersService } from '../users/users.service'
import { ProductComponent } from './product.component'
import { ProductAddComponent } from './product-add.component'
import { Observable } from 'rxjs/Observable';
import { RouteParams } from '@angular/router-deprecated';
import { ActiveService, ActiveElementDirective, ActivateOnFocusDirective, DeactivateOnBlurDirective } from '../shared/active-elements'

@Component({
  selector: 'cc-products-page',
  templateUrl: 'app/products/products-page.component.html',
  directives: [ProductComponent, ActiveElementDirective, ProductAddComponent, ActivateOnFocusDirective, DeactivateOnBlurDirective],
  providers: [ProductService, UsersService, ActiveService]
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
    this.productService.add(product, this.queryParams).subscribe(products => {
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
    this.productService.update(product.id, product, this.queryParams).subscribe(products => {});
  }
}