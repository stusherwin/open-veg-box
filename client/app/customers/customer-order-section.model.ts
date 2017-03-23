import { CustomerOrderModel, CustomerOrderAvailableItem } from './customer-order.model'
import { CustomerOrderItemModel } from './customer-order-item.model'
import { CustomerOrderItem } from './customer'
import { Arrays } from '../shared/arrays';

export class CustomerOrderSectionModel {
  editingTotal: number;
  addingItem: CustomerOrderAvailableItem;
  addingItemQuantity = 1;
  itemsAvailable: CustomerOrderAvailableItem[]
  items: CustomerOrderItemModel[]

  constructor(
    orderItems: CustomerOrderItem[],
    private  _all: CustomerOrderAvailableItem[],
    private _add: (item: CustomerOrderAvailableItem, quantity: number) => void,
    private _update: (item: CustomerOrderItemModel) => void,
    private _remove: (item: CustomerOrderItemModel) => void,
    private _recalculate: () => void
  ) {
    this.itemsAvailable = Arrays.exceptByOther(
      _all, i => i.id,
      orderItems, i => i.id
    );
    this.items = orderItems.map(i => CustomerOrderItemModel.fromOrderItem(
      i,
      (item: CustomerOrderItemModel) => {
        this.recalculateTotal();
        _update(item);
      },
      (item: CustomerOrderItemModel) => {
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
    let newItem = CustomerOrderItemModel.fromAvailableItem(
      this.addingItem,
      this.addingItemQuantity,
      (item: CustomerOrderItemModel) => {},
      (item: CustomerOrderItemModel) => Arrays.removeWhere(this.items, i => i.id == item.id),
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