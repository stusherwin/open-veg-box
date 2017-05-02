import { Product } from '../../products/product'
import { Box } from '../../boxes/box'
import { Order, OrderItem } from './order'
import { OrderService } from './order.service'
import { Arrays } from '../../shared/arrays';
import { Observable } from 'rxjs/Observable'

export interface IOrderItemService {
  add(itemId: number, quantity: number): Observable<any>;
  update(itemId: number, quantity: number): Observable<any>;
  remove(itemId: number): Observable<any>;
}

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
  addingSection: OrderSectionModel;
  editingItem: OrderItemModel;

  constructor(
    order: Order,
    boxes: Box[],
    products: Product[],
    orderService: OrderService
  ) {
    let allBoxes = boxes.map(b => ({
     id: b.id,
     name: b.name,
     price: b.price,
     unitType: 'each'
    }));

    this.boxesSection = new OrderSectionModel(order.boxes, allBoxes, {
      add(itemId: number, quantity: number): Observable<any> {
        return orderService.addBox(order.id, itemId, {quantity});
      },
      update(itemId: number, quantity: number): Observable<any> {
        return orderService.updateBox(order.id, itemId, {quantity});
      },
      remove(itemId: number): Observable<any> {
        return orderService.removeBox(order.id, itemId);
      }
    }, this);

    this.productsSection = new OrderSectionModel(order.extraProducts, products, {
      add(itemId: number, quantity: number): Observable<any> {
        return orderService.addProduct(order.id, itemId, {quantity});
      },
      update(itemId: number, quantity: number): Observable<any> {
        return orderService.updateProduct(order.id, itemId, {quantity});
      },
      remove(itemId: number): Observable<any> {
        return orderService.removeProduct(order.id, itemId);
      }
    }, this);
  }
  
  get total(): number {
    return this.boxesSection.total + this.productsSection.total;
  }
  
  get editingTotal(): number {
    return this.boxesSection.editingTotal + this.productsSection.editingTotal;
  }

  startAdd(section: OrderSectionModel) {
    this.addingSection = section;
    this.editingItem = null;
  }

  endAdd() {
    this.addingSection = null;
  }

  startEdit(item: OrderItemModel) {
    this.editingItem = item;
    this.addingSection = null;
  }

  endEdit() {
    this.editingItem = null;
  }
}

export class OrderSectionModel {
  items: OrderItemModel[];
  addingItem: IOrderAvailableItem;
  addingItemQuantity: number;

  constructor(
      items: OrderItem[],
      private _allItems: IOrderAvailableItem[],
      private _service: IOrderItemService,
      private _order: OrderModel) {
    this.items = items.map(i => new OrderItemModel(i.id, i.name, i.price, i.quantity, i.unitType, this));
    this.addingItem = this.itemsAvailable[0];
    this.addingItemQuantity = 1;
  }

  get adding() {
    return this._order.addingSection == this;
  }

  get editingItem() {
    return this._order.editingItem;
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
    this.addingItem = this.itemsAvailable[0];
    this.addingItemQuantity = 1;
    this._order.startAdd(this);
  }

  completeAdd() {
    this._service.add(this.addingItem.id, this.addingItemQuantity).subscribe(_ => {
      this.items.unshift(new OrderItemModel(this.addingItem.id, this.addingItem.name, this.addingItem.price, this.addingItemQuantity, this.addingItem.unitType, this));
      this._order.endAdd();
    });
  }

  cancelAdd() {
    this._order.endAdd();
  }

  removeItem(item: OrderItemModel) {
    this._order.endAdd();
    this._order.endEdit();
    this._service.remove(item.id).subscribe(_ => {
      Arrays.remove(this.items, item);
    })
  }

  updateItem(itemId: number, quantity: number): Observable<any> {
    return this._service.update(itemId, quantity);
  }

  startEdit(item: OrderItemModel) {
    this._order.startEdit(item);
  }

  endEdit() {
    this._order.endEdit();
  }
}

export class OrderItemModel {
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

  get editing() {
    return this._section.editingItem == this;
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
    this.editingQuantity = this.quantity;
    this._section.startEdit(this);
  }

  completeEdit() {
    this._section.updateItem(this.id, this.editingQuantity).subscribe(_ => {
      this.quantity = this.editingQuantity;
      this._section.endEdit();
    })
  }

  cancelEdit() {
    this._section.endEdit();
    this.editingQuantity = this.quantity;
  }
}