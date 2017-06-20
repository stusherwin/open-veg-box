import { Product } from '../../products/product'
import { Box } from '../../boxes/box'
import { Order, OrderItem, OrderDiscount } from './order'
import { OrderService } from './order.service'
import { Arrays } from '../../shared/arrays';
import { Observable } from 'rxjs/Observable'
import 'rxjs/add/operator/do';

export interface IOrderAvailableItem {
  id: number;
  price: number;
  name: string;
  unitType: string;
}

export interface IOrderItem {
  id: number;
  name: string;
  unitType: string;
}

export class OrderModel {
  boxesSection: OrderSectionModel;
  productsSection: OrderSectionModel;
  discountsSection: OrderDiscountsSectionModel;

  constructor(
    private _order: Order,
    boxes: Box[],
    products: Product[],
    private _service: OrderService
  ) {
    let allBoxes = boxes.map(b => ({
     id: b.id,
     name: b.name,
     price: b.price,
     unitType: 'each'
    }));
    this.boxesSection = new OrderSectionModel(_order.boxes, allBoxes, this, 'Box');

    let allProducts = products.map(p => ({
     id: p.id,
     name: p.name,
     price: p.unitPrice.price,
     unitType: p.unitPrice.unitType
    }));
    this.productsSection = new OrderSectionModel(_order.extraProducts, allProducts, this, 'Product');

    this.discountsSection = new OrderDiscountsSectionModel(_order.discounts, this);
  }
  
  get total(): number {
    return this.boxesSection.total + this.productsSection.total + this.discountsSection.total;
  }
  
  get editingTotal(): number {
    return this.boxesSection.editingTotal + this.productsSection.editingTotal + this.discountsSection.editingTotal;
  }

  addBox(boxId: number, quantity: number): Observable<any> {
    return this._service.addBox(this._order.id, boxId, {quantity})
                        .do(o => {
                          this._order.total = o.newOrderTotal;
                        });
  }

  updateBox(boxId: number, quantity: number): Observable<any> {
    return this._service.updateBox(this._order.id, boxId, {quantity})
                        .do(o => this._order.total = o.newOrderTotal);
  }

  removeBox(boxId: number): Observable<any> {
    return this._service.removeBox(this._order.id, boxId)
                        .do(o => this._order.total = o.newOrderTotal);
  }

  addProduct(productId: number, quantity: number): Observable<any> {
    return this._service.addProduct(this._order.id, productId, {quantity})
                        .do(o => this._order.total = o.newOrderTotal);
  }

  updateProduct(productId: number, quantity: number): Observable<any> {
    return this._service.updateProduct(this._order.id, productId, {quantity})
                        .do(o => this._order.total = o.newOrderTotal);
  }

  removeProduct(productId: number): Observable<any> {
    return this._service.removeProduct(this._order.id, productId)
                        .do(o => this._order.total = o.newOrderTotal);
  }

  addDiscount(name: string, total: number): Observable<number> {
    return this._service.addDiscount(this._order.id, {name, total})
                        .do(o => this._order.total = o.newOrderTotal)
                        .map(o => o.newDiscountId);
  }

  updateDiscount(discountId: number, name: string, total: number): Observable<any> {
    return this._service.updateDiscount(this._order.id, discountId, {name, total})
                        .map(o => this._order.total = o.newOrderTotal);
  }

  removeDiscount(discountId: number): Observable<any> {
    return this._service.removeDiscount(this._order.id, discountId)
                        .map(o => this._order.total = o.newOrderTotal);
  }
}

export class OrderSectionModel {
  items: OrderItemModel[];
  adding: boolean;
  addingItem: IOrderAvailableItem;
  addingItemQuantity: number;

  constructor(
      private _items: OrderItem[],
      private _allItems: IOrderAvailableItem[],
      private _order: OrderModel,
      private _itemType: string) {
    this.items = _items.map(i => new OrderItemModel(i.id, i.name, i.price, i.quantity, i.unitType, this));
    this.addingItem = this.itemsAvailable[0];
    this.addingItemQuantity = 1;
  }

  get itemsAvailable() {
    return Arrays.exceptByOther(
      this._allItems, i => i.id,
      this.items, i => i.id
    );
  }

  get total(): number {
    return this.items.reduce((total, i) => total + i.total, 0);
  }

  get addingItemTotal(): number {
    if(!this.adding) {
      return 0;
    }

    return this.addingItem.price * this.addingItemQuantity;
  }

  get editingTotal(): number {
    return this.items.reduce((total, i) => total + i.editingTotal, 0) +
      this.addingItemTotal;
  }

  startAdd() {
    this.adding = true;
    this.addingItem = this.itemsAvailable[0];
    this.addingItemQuantity = 1;
  }

  completeAdd() {
   console.log('completeAdd')

    this._order['add' + this._itemType](this.addingItem.id, this.addingItemQuantity).subscribe(() => {
      console.log('completeAdd (back from server)')
      this._items.unshift(new OrderItem(this.addingItem.id, this.addingItem.name, this.addingItem.price, this.addingItemQuantity, this.addingItem.unitType, this.addingItem.price * this.addingItemQuantity))
      this.items.unshift(new OrderItemModel(this.addingItem.id, this.addingItem.name, this.addingItem.price, this.addingItemQuantity, this.addingItem.unitType, this));
      this.adding = false;
    });
  }

  cancelAdd() {
    this.adding = false;
  }

  removeItem(item: OrderItemModel) {
    this._order['remove' + this._itemType](item.id).subscribe(() => {
      Arrays.removeWhere(this._items, i => i.id == item.id);
      Arrays.remove(this.items, item);
    })
  }

  updateItem(itemId: number, quantity: number): Observable<any> {
    return this._order['update' + this._itemType](itemId, quantity).do(() => {
      let item = this._items.find(i => i.id == itemId);
      item.quantity = quantity;
      item.total = item.price * item.quantity;
    });
  }
}

export class OrderItemModel {
  editing: boolean;
  editingQuantity: number;

  constructor(
      public id: number,
      public name: string,
      public price: number,
      public quantity: number,
      public unitType: string,
      private _section: OrderSectionModel) {
    this.editingQuantity = quantity;
  }

  get total() {
    return this.price * this.quantity;
  }

  get editingTotal() {
    return this.price * (this.editing? this.editingQuantity : this.quantity);
  }

  remove() {
    this._section.removeItem(this);
  }

  startEdit() {
    this.editing = true;
    this.editingQuantity = this.quantity;
  }

  completeEdit() {
    this._section.updateItem(this.id, this.editingQuantity).subscribe(_ => {
      this.quantity = this.editingQuantity;
      this.editing = false;
    })
  }

  cancelEdit() {
    this.editing = false;
    this.editingQuantity = this.quantity;
  }
}

export class OrderDiscountsSectionModel {
  items: OrderDiscountModel[];
  adding: boolean;
  addingItemName: string;
  addingItemTotal: number;

  constructor(
      private _items: OrderDiscount[],
      private _order: OrderModel) {
    this.items = _items.map(i => new OrderDiscountModel(i.id, i.name, i.total, this));
    this.addingItemTotal = 0;
    this.addingItemName = '';
  }

  get total(): number {
    return this.items.reduce((total, i) => total + i.total, 0);
  }

  get editingTotal(): number {
    return this.items.reduce((total, i) => total + i.editingTotal, 0) +
      (this.addingItemTotal || 0);
  }

  startAdd() {
    console.log('startAdd')
    this.adding = true;
    this.addingItemTotal = 0;
    this.addingItemName = 'Manual discount';
  }

  completeAdd() {
   console.log('completeAdd')

    this._order.addDiscount(this.addingItemName, this.addingItemTotal).subscribe(id => {
      console.log('completeAdd (back from server)')
      this._items.unshift(new OrderDiscount(id, this.addingItemName, this.addingItemTotal));
      this.items.unshift(new OrderDiscountModel(id, this.addingItemName, this.addingItemTotal, this));
      this.adding = false;
      this.addingItemTotal = 0;
      this.addingItemName = '';
    });
  }

  cancelAdd() {
    this.adding = false;
    this.addingItemTotal = undefined;
    this.addingItemName = '';
  }

  removeItem(item: OrderDiscountModel) {
    this._order.removeDiscount(item.id).subscribe(_ => {
      Arrays.removeWhere(this._items, i => i.id == item.id);
      Arrays.remove(this.items, item);
    })
  }

  updateItem(discountId: number, name: string, total: number): Observable<any> {
    return this._order.updateDiscount(discountId, name, total).do(() => {
      let item = this._items.find(i => i.id == discountId);
      item.name = name;
      item.total = total;
    });;
  }
}

export class OrderDiscountModel {
  editing: boolean;
  editingTotal: number;
  editingName: string;

  constructor(
      public id: number,
      public name: string,
      public total: number,
      private _section: OrderDiscountsSectionModel) {
    this.editingTotal = total;
    this.editingName = name;
  }

  remove() {
    this._section.removeItem(this);
  }

  startEdit() {
    this.editing = true;
    this.editingTotal = this.total;
    this.editingName = this.name;
  }

  completeEdit() {
    this._section.updateItem(this.id, this.editingName, this.editingTotal).subscribe(_ => {
      this.total = this.editingTotal;
      this.name = this.editingName;
      this.editing = false;
    })
  }

  cancelEdit() {
    this.editing = false;
    this.editingTotal = this.total;
    this.editingName = this.name;
  }
}