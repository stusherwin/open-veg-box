import { OrderModel } from '../orders/order.model'
import { Product } from '../../products/product'
import { Box } from '../../boxes/box'
import { CustomerWithOrder } from '../customer'
import { CustomerService } from '../customer.service'
import { Order } from '../orders/order'
import { OrderService } from '../orders/order.service'

export class CustomerModel {
  id: number;
  name: string;
  address: string;
  tel1: string;
  email: string;

  constructor(
    private _customer: CustomerWithOrder,
    customerService: CustomerService
  ) {
    this.id = _customer.id;
    this.name = _customer.name;
    this.address = _customer.address;
    this.tel1 = _customer.tel1;
    this.email = _customer.email;
    this.update = (properties: {[property: string]: any}) => {
      console.log('update customer ' + _customer.id + ':');
      console.log(properties);
      customerService.update(_customer.id, properties, {}).subscribe(customers => {
      });
    };
  }

  update: (properties: {[property: string]: any}) => void;
}