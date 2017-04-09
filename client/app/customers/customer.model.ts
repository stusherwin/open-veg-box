import { Box } from '../boxes/box'
import { Product } from '../products/product';
import { Order } from './orders/order'

export class CustomerModel {
  id: number;
  name: string;
  address: string;
  tel1: string;
  email: string;
  order: CustomerOrderModel;

  delete: () => void;
  update: (properties: {[property: string]: any}) => void;
}

export class CustomerOrderModel {
  order: Order;
  boxes: Box[];
  products: Product[];
}

export class AddCustomerModel {
  add: (properties: {[property: string]: any}) => void;
}