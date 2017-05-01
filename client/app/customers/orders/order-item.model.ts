import { OrderModel, OrderAvailableItem, IOrderItemService } from './order.model'
import { OrderItem } from './order'

export class OrderItemModel {
  id: number;
  name: string;
  price: number;
  quantity: number;
  unitType: string;
  total: number;
  editingTotal: number;
  editingQuantity: number;
  editing = false;

  constructor(
    id: number,
    name: string,
    price: number,
    quantity: number,
    unitType: string,
    total: number,
    editingTotal: number,
    private _service: IOrderItemService,
    private totalRecalculationNeeded: () => void,
    private editingTotalRecalculationNeeded: () => void
  ) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.quantity = quantity;
    this.unitType = unitType;
    this.total = total;
    this.editingTotal = editingTotal;
    this.editingQuantity = quantity;
  }

  static fromItem (
      item: IOrderItem,
      price: number,
      quantity: number,
      total: number,
      service: IOrderItemService,
      totalRecalculationNeeded: () => void,
      editingTotalRecalculationNeeded: () => void
  ): OrderItemModel {
    return new OrderItemModel(
      item.id,
      item.name,
      price,
      quantity,
      item.unitType,
      total,
      total,
      service,
      totalRecalculationNeeded,
      editingTotalRecalculationNeeded
    )
  }

  remove() {
    this._service.remove(this);
    this.totalRecalculationNeeded();
  }

  startEdit() {
    this.editing = true;
    this.editingQuantity = this.quantity;
  }

  endEdit() {
    this.quantity = this.editingQuantity;
    this._service.update(this);
    this.total = this.price * this.quantity;
    this.editingTotal = this.total;
    this.totalRecalculationNeeded();
    this.editing = false;
    this.editingQuantity = this.quantity;
  }

  cancelEdit() {
    this.editing = false;
    this.editingQuantity = this.quantity;
    this.recalculateEditingTotal();
  }

  recalculateEditingTotal() {
    this.editingTotal = this.price * this.editingQuantity;
    this.editingTotalRecalculationNeeded();
  }
}

export interface IOrderItem {
  id: number;
  name: string;
  unitType: string;
}