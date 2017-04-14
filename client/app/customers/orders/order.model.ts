import { Product } from '../../products/product'
import { Box } from '../../boxes/box'
import { Order, OrderItem } from './order'
import { OrderSectionModel } from './order-section.model'
import { OrderItemModel } from './order-item.model'
import { OrderService } from './order.service'

export class OrderModel {
  boxes: OrderSectionModel;
  products: OrderSectionModel;
  total: number;
  editingTotal: number;
  private _addBox: (item: OrderAvailableItem, quantity: number) => void;
  private _updateBox: (item: OrderItemModel) => void;
  private _removeBox: (item: OrderItemModel) => void;
  private _addProduct: (item: OrderAvailableItem, quantity: number) => void;
  private _updateProduct: (item: OrderItemModel) => void;
  private _removeProduct: (item: OrderItemModel) => void;

  constructor(
    private _order: Order,
    private _boxes: Box[],
    private _products: Product[],
    orderService: OrderService
  ) {
    this._addBox = (item: OrderAvailableItem, quantity: number) => {
      console.log('add box ' + item.id + '(' + quantity + ') to order ' + _order.id);
      orderService.addBox(_order.id, item.id, {quantity}).subscribe(o => this.populate(o))
    };
    this._updateBox = (item: OrderItemModel) => {
      console.log('update box ' + item.id + ' quantity to ' + item.quantity + ' on order ' + _order.id);
      orderService.updateBox(_order.id, item.id, {quantity: item.quantity}).subscribe(o => this.populate(o))
    };
    this._removeBox = (item: OrderItemModel) => {
      console.log('delete box ' + item.id + ' from order ' + _order.id);
      orderService.removeBox(_order.id, item.id).subscribe(o => this.populate(o))
    };
    this._addProduct = (item: OrderAvailableItem, quantity: number) => {
      console.log('add product ' + item.id + '(' + quantity + ') to order ' + _order.id);
      orderService.addProduct(_order.id, item.id, {quantity}).subscribe(o => this.populate(o))
    };
    this._updateProduct = (item: OrderItemModel) => {
      console.log('update product ' + item.id + ' quantity to ' + item.quantity + ' on order ' + _order.id);
      orderService.updateProduct(_order.id, item.id, {quantity: item.quantity}).subscribe(o => this.populate(o))
    };
    this._removeProduct = (item: OrderItemModel) => {
      console.log('delete product ' + item.id + ' from order ' + _order.id);
      orderService.removeProduct(_order.id, item.id).subscribe(o => this.populate(o))
    };
    this.populate(_order);
  }

  private populate(order: Order) {
    this.total = order.total;
    this.editingTotal = order.total;
    
    this.products = new OrderSectionModel(
      order.extraProducts,
      this._products,
      this._addProduct,
      this._updateProduct,
      this._removeProduct,
      () => this.recalculateTotal()
    );

    this.boxes = new OrderSectionModel(
      order.boxes,
      this._boxes.map(b => ({
        id: b.id,
        name: b.name,
        price: b.price,
        unitType: 'each'
      })),
      this._addBox,
      this._updateBox,
      this._removeBox,
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