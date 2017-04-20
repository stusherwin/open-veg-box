import { Product } from '../../products/product'
import { Box } from '../../boxes/box'
import { Order, OrderItem } from './order'
import { OrderSectionModel } from './order-section.model'
import { OrderItemModel } from './order-item.model'
import { OrderService } from './order.service'

export interface IOrderItemService {
  add: (item: OrderAvailableItem, quantity: number) => void;
  update: (item: OrderItemModel) => void;
  remove: (item: OrderItemModel) => void;
}

export class OrderModel {
  boxes: OrderSectionModel;
  products: OrderSectionModel;
  total: number;
  editingTotal: number;
  private _boxService: IOrderItemService;
  private _productService: IOrderItemService

  constructor(
    private _order: Order,
    private _boxes: Box[],
    private _products: Product[],
    orderService: OrderService
  ) {
    this._boxService = {
      add: (item: OrderAvailableItem, quantity: number) => {
        console.log('add box ' + item.id + '(' + quantity + ') to order ' + _order.id);
        orderService.addBox(_order.id, item.id, {quantity}).subscribe(o => {});//this.populate(o))
      },
      update: (item: OrderItemModel) => {
        console.log('update box ' + item.id + ' quantity to ' + item.quantity + ' on order ' + _order.id);
        orderService.updateBox(_order.id, item.id, {quantity: item.quantity}).subscribe(o => {});//this.populate(o))
      },
      remove: (item: OrderItemModel) => {
        console.log('delete box ' + item.id + ' from order ' + _order.id);
        orderService.removeBox(_order.id, item.id).subscribe(o => {});//this.populate(o))
      }
    };
    this._productService = {
      add: (item: OrderAvailableItem, quantity: number) => {
        console.log('add product ' + item.id + '(' + quantity + ') to order ' + _order.id);
        orderService.addProduct(_order.id, item.id, {quantity}).subscribe(o => {});//this.populate(o))
      },
      update: (item: OrderItemModel) => {
        console.log('update product ' + item.id + ' quantity to ' + item.quantity + ' on order ' + _order.id);
        orderService.updateProduct(_order.id, item.id, {quantity: item.quantity}).subscribe(o => {});//this.populate(o))
      },
      remove: (item: OrderItemModel) => {
        console.log('delete product ' + item.id + ' from order ' + _order.id);
        orderService.removeProduct(_order.id, item.id).subscribe(o => {});//this.populate(o))
      }
    };
    this.populate(_order);
  }

  private populate(order: Order) {
    this.total = order.total;
    this.editingTotal = order.total;
    
    this.products = new OrderSectionModel(
      order.extraProducts,
      this._products,
      this._productService,
      () => this.recalculateTotal(),
      () => this.recalculateEditingTotal()
    );

    this.boxes = new OrderSectionModel(
      order.boxes,
      this._boxes.map(b => ({
        id: b.id,
        name: b.name,
        price: b.price,
        unitType: 'each'
      })),
      this._boxService,
      () => this.recalculateTotal(),
      () => this.recalculateEditingTotal()
    );
  }

  recalculateEditingTotal() {
    console.log('recalculateEditingTotal')
    this.boxes.recalculateEditingTotal();
    this.products.recalculateEditingTotal();

    this.editingTotal =
      this.boxes.editingTotal +
      this.products.editingTotal;
  }

  recalculateTotal() {
    console.log('recalculateTotal')
    this.boxes.recalculateTotal();
    this.products.recalculateTotal();

    this.total =
      this.boxes.total +
      this.products.total;

    this.editingTotal = this.total;
  }
}

export interface OrderAvailableItem {
  id: number;
  price: number;
  name: string;
  unitType: string;
}