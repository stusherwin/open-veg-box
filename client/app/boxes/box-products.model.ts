import { Product, ProductQuantity } from '../products/product'
import { Box, BoxWithProducts } from '../boxes/box'
import { BoxService } from './box.service'
import { Arrays } from '../shared/arrays';
import { Observable } from 'rxjs/Observable'

export interface IProduct {
  id: number;
  name: string;
  unitType: string;
}

export class BoxProductsModel {
  products: BoxProductModel[];
  _allProducts: IProduct[];
  adding: boolean;
  addingProduct: IProduct;
  addingProductQuantity: number;

  constructor(
      private _box: BoxWithProducts,
      allProducts: Product[],
      private _service: BoxService) {
    this._allProducts = allProducts.map(p => ({id: p.id, name: p.name, unitType: p.unitPrice.unitType}))
    this.products = this._box.products.map(i => new BoxProductModel(i.id, i.name, i.unitType, i.quantity, this));
    this.addingProduct = this.productsAvailable[0];
    this.addingProductQuantity = 1;
  }

  get productsAvailable() {
    return Arrays.exceptByOther(
      this._allProducts, i => i.id,
      this.products, i => i.id
    );
  }

  startAdd() {
    this.adding = true;
    this.addingProduct = this.productsAvailable[0];
    this.addingProductQuantity = 1;
  }

  completeAdd() {
    this._service.addProduct(this._box.id, this.addingProduct.id, {quantity: this.addingProductQuantity}).subscribe(() => {
      console.log('completeAdd (back from server)')
      this.products.unshift(new BoxProductModel(this.addingProduct.id, this.addingProduct.name, this.addingProduct.unitType, this.addingProductQuantity, this));
      this.adding = false;
    });
  }

  cancelAdd() {
    this.adding = false;
  }

  removeProduct(product: BoxProductModel) {
    this._service.removeProduct(this._box.id, product.id).subscribe(() => {
      Arrays.remove(this.products, product);
    })
  }

  updateProduct(productId: number, quantity: number): Observable<void> {
    return this._service.updateProduct(this._box.id, productId, {quantity});
  }
}

export class BoxProductModel {
  editing: boolean;
  editingQuantity: number;

  constructor(
      public id: number,
      public name: string,
      public unitType: string,
      public quantity: number,
      private _section: BoxProductsModel) {
    this.editingQuantity = quantity;
  }

  remove() {
    this._section.removeProduct(this);
  }

  startEdit() {
    this.editing = true;
    this.editingQuantity = this.quantity;
  }

  completeEdit() {
    this._section.updateProduct(this.id, this.editingQuantity).subscribe(_ => {
      this.quantity = this.editingQuantity;
      this.editing = false;
    })
  }

  cancelEdit() {
    this.editing = false;
    this.editingQuantity = this.quantity;
  }
}