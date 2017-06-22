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
  collectionPoint: {id: number, name: string};
  collectionPointOptions = [
    {id: 1, name: 'Point A'},
    {id: 2, name: 'Point B'}
  ];

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
    this.collectionPoint = this.collectionPointOptions.find(c => c.id == _customer.collectionPointId) || null;

    this.update = (properties: {[property: string]: any}) => {
      customerService.update(_customer.id, properties).subscribe(() => {
        for(let p in properties) {
          _customer[p] = properties[p];
        }
      });
    };
  }

  update: (properties: {[property: string]: any}) => void;

  updateCollectionPoint(value: {id: number, name: string}) {
    if(!value) {
      console.log('none');
    } else {
      console.log(value.id);
    }
  }
}