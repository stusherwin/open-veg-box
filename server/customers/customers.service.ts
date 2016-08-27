import {Customer} from './customer'

const defaultPageSize: number = 10;

export class CustomersService {

  private customers: Customer[] = [
    new Customer(1, "Fred Bloggs"),
    new Customer(2, "Jane Doe")
  ];

  private updateProperty(dest: any, source: any, propertyName: string) {
    if(Object.getOwnPropertyNames(source).indexOf(propertyName) >= 0) {
      dest[propertyName] = source[propertyName];
    }
  }

  getAll(queryParams: any): Customer[] {
    var pageSize = +(queryParams.pageSize || defaultPageSize);
    var startIndex = (+(queryParams.page || 1) - 1) * pageSize;
    var endIndex = startIndex + pageSize;

    return this.customers.slice(startIndex, endIndex); 
  }

  add(params: any, queryParams: any): Customer[] {
    var id = this.customers.map(p => p.id).reduce((m, c) => c > m ? c : m, 0) + 1;
    var customer = new Customer(id, params.name);
    this.customers.splice(0, 0, customer);

    return this.getAll(queryParams);
  }

  update(id: number, params: any, queryParams: any): Customer[] {
    var customer = this.customers.find(p => p.id == id);
    if(customer == null) {
      return null;
    }

    this.updateProperty(customer, params, 'name');

    return this.getAll(queryParams);
  }
}