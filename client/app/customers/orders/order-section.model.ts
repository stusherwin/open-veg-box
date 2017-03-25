import { OrderModel, OrderAvailableItem } from './order.model'
import { OrderItemModel } from './order-item.model'
import { OrderItem } from './order'
import { Arrays } from '../../shared/arrays';

export class OrderSectionModel {
  editingTotal: number;
  addingItem: OrderAvailableItem;
  addingItemQuantity = 1;
  itemsAvailable: OrderAvailableItem[]
  items: OrderItemModel[]

  constructor(
    orderItems: OrderItem[],
    private  _all: OrderAvailableItem[],
    private _add: (item: OrderAvailableItem, quantity: number) => void,
    private _update: (item: OrderItemModel) => void,
    private _remove: (item: OrderItemModel) => void,
    private _recalculate: () => void
  ) {
    this.itemsAvailable = Arrays.exceptByOther(
      _all, i => i.id,
      orderItems, i => i.id
    );
    this.items = orderItems.map(i => OrderItemModel.fromOrderItem(
      i,
      (item: OrderItemModel) => {
        this.recalculateTotal();
        _update(item);
      },
      (item: OrderItemModel) => {
        Arrays.removeWhere(this.items, i => i.id == item.id);
        this.itemsAvailable = Arrays.exceptByOther(
          _all, i => i.id,
          this.items, i => i.id
        )
        this.recalculateTotal()
        _remove(item);
      },
      () => this.recalculateTotal()
    ))

    this.editingTotal = this.items.reduce((total, i) => total + i.editingTotal, 0);
  }

  add() {
    let newItem = OrderItemModel.fromAvailableItem(
      this.addingItem,
      this.addingItemQuantity,
      (item: OrderItemModel) => {},
      (item: OrderItemModel) => Arrays.removeWhere(this.items, i => i.id == item.id),
      () => this.recalculateTotal()
    );
    this.items.push(newItem);
    this.itemsAvailable = Arrays.exceptByOther(
      this._all, i => i.id,
      this.items, i => i.id
    );

    this._add(this.addingItem, this.addingItemQuantity);
  }

  startAdd() {
    this.addingItem = this.itemsAvailable[0];
    this.addingItemQuantity = 1;
    this.recalculateTotal();
  }

  cancelAdd() {
    this.addingItem = undefined;
    this.addingItemQuantity = 1;
    this.recalculateTotal();   
  }

  recalculateTotal() {
    this.editingTotal = this.items.reduce((total, i) => total + i.editingTotal, 0);
    if(this.addingItem) {
      this.editingTotal += this.addingItem.price * this.addingItemQuantity;
    }

    this._recalculate();
  }
}