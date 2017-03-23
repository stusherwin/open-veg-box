import { Product } from '../products/product'
import { Box } from '../boxes/box'
import { CustomerOrder, CustomerOrderItem } from './customer'
import { CustomerOrderSectionModel } from './customer-order-section.model'
import { CustomerOrderItemModel } from './customer-order-item.model'

export class CustomerOrderModel {
  boxes: CustomerOrderSectionModel;
  products: CustomerOrderSectionModel;
  total: number;
  editingTotal: number;

  constructor(
    private _order: CustomerOrder,
    private _boxes: Box[],
    private _products: Product[],
    private _addBox: (item: CustomerOrderAvailableItem, quantity: number) => void,
    private _updateBox: (item: CustomerOrderItemModel) => void,
    private _removeBox: (item: CustomerOrderItemModel) => void,
    private _addProduct: (item: CustomerOrderAvailableItem, quantity: number) => void,
    private _updateProduct: (item: CustomerOrderItemModel) => void,
    private _removeProduct: (item: CustomerOrderItemModel) => void
  ) {
    this.total = _order.total;
    this.editingTotal = _order.total;
    
    this.products = new CustomerOrderSectionModel(
      _order.extraProducts,
      _products,
      _addProduct,
      _updateProduct,
      _removeProduct,
      () => this.recalculateTotal()
    );

    this.boxes = new CustomerOrderSectionModel(
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

export interface CustomerOrderAvailableItem {
  id: number;
  price: number;
  name: string;
  unitType: string;
}