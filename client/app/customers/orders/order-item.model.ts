import { OrderModel, OrderAvailableItem } from './order.model'
import { OrderItem } from './order'

export class OrderItemModel {
  id: number;
  name: string;
  price: number;
  quantity: number;
  unitType: string;
  total: number;
  editingTotal: number;

  constructor(
    id: number,
    name: string,
    price: number,
    quantity: number,
    unitType: string,
    total: number,
    editingTotal: number,
    private _update: (item: OrderItem) => void,
    private _remove: (item: OrderItem) => void,
    private _recalculate: () => void
  ) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.quantity = quantity;
    this.unitType = unitType;
    this.total = total;
    this.editingTotal = editingTotal;
  }

  static fromAvailableItem (
      item: OrderAvailableItem,
      quantity: number,
      update: (item: OrderItemModel) => void,
      remove: (item: OrderItemModel) => void,
      recalculate: () => void
  ): OrderItemModel {
    return new OrderItemModel(
      item.id,
      item.name,
      item.price,
      quantity,
      item.unitType,
      item.price * quantity,
      item.price * quantity,
      update,
      remove,
      recalculate
    )
  }
  
  static fromOrderItem(
      item: OrderItem,
      update: (item: OrderItemModel) => void,
      remove: (item: OrderItemModel) => void,
      recalculate: () => void): OrderItemModel {
    return new OrderItemModel(
      item.id,
      item.name,
      item.total / item.quantity,
      item.quantity,
      item.unitType,
      item.total,
      item.total,
      update,
      remove,
      recalculate
    )
  }

  remove() {
    this._remove(this);
  }

  updateQuantity(quantity: number) {
    this._update(this);
  }

  modifyQuantity(quantity: number) {
    console.log('quantity modified: ' + quantity)
    this.editingTotal = this.price * quantity;
    this._recalculate();
  }
}