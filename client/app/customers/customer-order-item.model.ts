import { CustomerOrderModel, CustomerOrderAvailableItem } from './customer-order.model'
import { CustomerOrderItem } from './customer'

export class CustomerOrderItemModel {
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
    private _update: (item: CustomerOrderItem) => void,
    private _remove: (item: CustomerOrderItem) => void,
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
      item: CustomerOrderAvailableItem,
      quantity: number,
      update: (item: CustomerOrderItemModel) => void,
      remove: (item: CustomerOrderItemModel) => void,
      recalculate: () => void
  ): CustomerOrderItemModel {
    return new CustomerOrderItemModel(
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
      item: CustomerOrderItem,
      update: (item: CustomerOrderItemModel) => void,
      remove: (item: CustomerOrderItemModel) => void,
      recalculate: () => void): CustomerOrderItemModel {
    return new CustomerOrderItemModel(
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