import { Product } from '../../products/product'
import { Box } from '../../boxes/box'
import { Order, OrderItem } from './order'
import { OrderSectionModel } from './order-section.model'
import { OrderItemModel } from './order-item.model'

export class OrderModel {
  boxes: OrderSectionModel;
  products: OrderSectionModel;
  total: number;
  editingTotal: number;

  constructor(
    private _order: Order,
    private _boxes: Box[],
    private _products: Product[],
    private _addBox: (item: OrderAvailableItem, quantity: number) => void,
    private _updateBox: (item: OrderItemModel) => void,
    private _removeBox: (item: OrderItemModel) => void,
    private _addProduct: (item: OrderAvailableItem, quantity: number) => void,
    private _updateProduct: (item: OrderItemModel) => void,
    private _removeProduct: (item: OrderItemModel) => void
  ) {
    this.total = _order.total;
    this.editingTotal = _order.total;
    
    this.products = new OrderSectionModel(
      _order.extraProducts,
      _products,
      _addProduct,
      _updateProduct,
      _removeProduct,
      () => this.recalculateTotal()
    );

    this.boxes = new OrderSectionModel(
      _order.boxes,
      _boxes.map(b => ({
        id: b.id,
        name: b.name,
        price: b.price,
        unitType: 'each'
      })),
      _addBox,
      _updateBox,
      _removeBox,
      () => this.recalculateTotal()
    );
  }

  recalculateTotal() {
    this.editingTotal =
      this.boxes.editingTotal +
      this.products.editingTotal;
  }
}

export interface OrderAvailableItem {
  id: number;
  price: number;
  name: string;
  unitType: string;
}