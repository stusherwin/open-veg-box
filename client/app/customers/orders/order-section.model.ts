import { OrderModel, OrderAvailableItem, IOrderItemService } from './order.model'
import { OrderItemModel } from './order-item.model'
import { OrderItem } from './order'
import { Arrays } from '../../shared/arrays';

export class OrderSectionModel {
  total: number;
  editingTotal: number;

  addingItem: OrderAvailableItem;
  addingItemQuantity = 1;
  itemsAvailable: OrderAvailableItem[]
  items: OrderItemModel[]

  constructor(
    orderItems: OrderItem[],
    private  _all: OrderAvailableItem[],
    private _service: IOrderItemService,
    private totalRecalculationNeeded: () => void,
    private editingTotalRecalculationNeeded: () => void
  ) {
    this.itemsAvailable = Arrays.exceptByOther(
      _all, i => i.id,
      orderItems, i => i.id
    );
    this.items = orderItems.map(i => OrderItemModel.fromItem(
      i,
      i.total / i.quantity,
      i.quantity,
      i.total,
      {
        add: _ => {},
        update: (item: OrderItemModel) => {
          //this.recalculateTotal();
          _service.update(item);
          this.totalRecalculationNeeded()
        },
        remove: (item: OrderItemModel) => {
          Arrays.removeWhere(this.items, i => i.id == item.id);
          this.itemsAvailable = Arrays.exceptByOther(
            _all, i => i.id,
            this.items, i => i.id
          )
          //this.recalculateTotal()
          _service.remove(item);
          this.totalRecalculationNeeded()
        }
      },
      this.totalRecalculationNeeded,
      this.editingTotalRecalculationNeeded
    ))

    this.editingTotal = this.items.reduce((total, i) => total + i.editingTotal, 0);
  }

  add() {
    let newItem = OrderItemModel.fromItem(
      this.addingItem,
      this.addingItem.price,
      this.addingItemQuantity,
      this.addingItem.price * this.addingItemQuantity,
      {
        add: _ => {},
        update: (item: OrderItemModel) => {
          //this.recalculateTotal();
          this._service.update(item);
          this.totalRecalculationNeeded()
        },
        remove: (item: OrderItemModel) => {
          Arrays.removeWhere(this.items, i => i.id == item.id);
          this.itemsAvailable = Arrays.exceptByOther(
            this._all, i => i.id,
            this.items, i => i.id
          )
          //this.recalculateTotal()
          this._service.remove(item);
          this.totalRecalculationNeeded()
        }
      },
      this.totalRecalculationNeeded,
      this.editingTotalRecalculationNeeded
    );
    this.items.unshift(newItem);
    this.itemsAvailable = Arrays.exceptByOther(
      this._all, i => i.id,
      this.items, i => i.id
    );

    this._service.add(this.addingItem, this.addingItemQuantity);
    this.addingItem = undefined;
    this.totalRecalculationNeeded()
  }

  startAdd() {
    this.addingItem = this.itemsAvailable[0];
    this.addingItemQuantity = 1;
    this.editingTotalRecalculationNeeded();   
  }

  cancelAdd() {
    this.addingItem = undefined;
    this.addingItemQuantity = 1;
    this.editingTotalRecalculationNeeded();   
  }

  recalculateEditingTotal() {
    this.editingTotal = this.items.reduce((total, i) => total + i.editingTotal, 0);
    if(this.addingItem) {
      this.editingTotal += this.addingItem.price * this.addingItemQuantity;
    }
  }

  recalculateTotal() {
    this.total = this.items.reduce((total, i) => total + i.total, 0);
    this.editingTotal = this.total;
  }
}