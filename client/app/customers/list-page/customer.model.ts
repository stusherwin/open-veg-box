export class CustomerModel {
  id: number;
  name: string;
  canEmail: boolean;
  address: string;
  tel: string;
  orderTotal: number;

  delete: () => void;
}

export class AddCustomerModel {
  add: (properties: {[property: string]: any}) => void;
}