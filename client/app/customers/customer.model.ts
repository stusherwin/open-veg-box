import { Box } from '../boxes/box'
import { Product } from '../products/product';
import { Order } from './orders/order'

export class CustomerModel {
  name: string;
  address: string;
  tel1: string;
  email: string;
  order: CustomerOrderModel;
  emailRouterLink: any[];

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