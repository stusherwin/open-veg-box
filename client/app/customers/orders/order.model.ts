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
        console.log('add box')
        return orderService.addBox(order.id, itemId, {quantity})
                           .map(o => {order.total = o.total; return o});
      },
      update(itemId: number, quantity: number): Observable<any> {
        return orderService.updateBox(order.id, itemId, {quantity})
                           .map(o => {order.total = o.total; return o});
      },
      remove(itemId: number): Observable<any> {
        return orderService.removeBox(order.id, itemId)
                           .map(o => {order.total = o.total; return o});
      }
    }, this);

    
    let allProducts = products.map(p => ({
     id: p.id,
     name: p.name,
     price: p.unitPrice.price,
     unitType: p.unitPrice.unitType
    }));

    this.productsSection = new OrderSectionModel(order.extraProducts, allProducts, {
      add(itemId: number, quantity: number): Observable<any> {
        return orderService.addProduct(order.id, itemId, {quantity})
                           .map(o => {order.total = o.total; return o});
      },
      update(itemId: number, quantity: number): Observable<any> {
        return orderService.updateProduct(order.id, itemId, {quantity})
                           .map(o => {order.total = o.total; return o});
      },
      remove(itemId: number): Observable<any> {
        return orderService.removeProduct(order.id, itemId)
                           .map(o => {order.total = o.total; return o});
      }
    }, this);
  }
  
  get total(): number {
    return this.boxesSection.total + this.productsSection.total;
  }
  
  get editingTotal(): number {
    return this.boxesSection.editingTotal + this.productsSection.editingTotal;
  }
}

export class OrderSectionModel {
  items: OrderItemModel[];
  adding: boolean;
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

    this._service.add(this.addingItem.id, this.addingItemQuantity).subscribe(_ => {
      console.log('completeAdd (back from server)')
      this.items.unshift(new OrderItemModel(this.addingItem.id, this.addingItem.name, this.addingItem.price, this.addingItemQuantity, this.addingItem.unitType, this));
      this.adding = false;
    });
  }

  cancelAdd() {
    this.adding = false;
  }

  removeItem(item: OrderItemModel) {
    this._service.remove(item.id).subscribe(_ => {
      Arrays.remove(this.items, item);
    })
  }

  updateItem(itemId: number, quantity: number): Observable<any> {
    return this._service.update(itemId, quantity);
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