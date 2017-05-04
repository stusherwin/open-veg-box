import { OrderModel } from '../orders/order.model'
import { Product } from '../../products/product'
import { Box } from '../../boxes/box'
import { CustomerWithOrder } from '../customer'
import { CustomerService } from '../customer.service'
import { Order } from '../orders/order'
import { OrderService } from '../orders/order.service'

export class CustomerModel {
  id: number;
  firstName: string;
  surname: string;
  address: string;
  tel1: string;
  tel2: string;
  email: string;

  constructor(
    private _customer: CustomerWithOrder,
    customerService: CustomerService
  ) {
    this.id = _customer.id;
    this.firstName = _customer.firstName;
    this.surname = _customer.surname;
    this.address = _customer.address;
    this.tel1 = _customer.tel1;
    this.tel2 = _customer.tel2;
    this.email = _customer.email;
    this.update = (properties: {[property: string]: any}) => {
      console.log('update customer ' + _customer.id + ':');
      console.log(properties);
      customerService.update(_customer.id, properties, {}).subscribe(_ => {
        for(let p in properties) {
          _customer[p] = properties[p];
        }
      });
    };
  }

  update: (properties: {[property: string]: any}) => void;
}