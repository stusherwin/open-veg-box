import { ListPageComponent } from './list-page.component';
import { CustomerWithOrder } from '../customer'

export class CustomerModel {
  id: number;
  name: string;
  canEmail: boolean;
  address: string;
  orderTotal: number;

  delete: () => void;
  constructor(id: number, name: string, address: string, email: string, orderTotal: number, parent: ListPageComponent) {
    this.id = id;
    this.name = name;
    this.address = address;
    this.canEmail = email && !!email.length;
    this.orderTotal = orderTotal;
    this.delete = () => {
      parent.delete(this);
    }
  }
}

export class AddCustomerModel {
  add: (properties: {[property: string]: any}) => void;
}