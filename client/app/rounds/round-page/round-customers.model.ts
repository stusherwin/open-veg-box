import { Customer } from '../../customers/customer'
import { Round, RoundCustomer } from '../round'
import { RoundService } from '../round.service'
import { Arrays } from '../../shared/arrays';
import { CustomerService } from '../../customers/customer.service'
import { Observable } from 'rxjs/Observable'
import 'rxjs/add/observable/combineLatest'
import 'rxjs/add/observable/concat'

export interface ICustomer {
  id: number;
  name: string;
  address: string;
}

export class RoundCustomersModel {
  customers: RoundCustomerModel[];
  adding: boolean;
  addingCustomer: ICustomer;

  constructor(
      private _round: Round,
      private _allCustomers: Customer[],
      private _service: RoundService,
      private _customerService: CustomerService) {
    this.customers = this._round.customers.map(c => new RoundCustomerModel(c.id, c.name, c.address, this));
    this.addingCustomer = this.customersAvailable[0];
  }

  get customersAvailable() {
    return Arrays.exceptByOther(
      this._allCustomers, i => i.id,
      this.customers, i => i.id
    );
  }

  startAdd() {
    this.adding = true;
    this.addingCustomer = this.customersAvailable[0];
  }

  completeAdd() {
    //TODO: Do this more idiomatically in rxjs
    this._service.addCustomer(this._round.id, this.addingCustomer.id, {}).subscribe(_ => {
      this._customerService.getAllWithNoRound({}).subscribe(customers => {
        console.log('completeAdd (back from server)')
        this.customers.unshift(new RoundCustomerModel(this.addingCustomer.id, this.addingCustomer.name, this.addingCustomer.address, this));
        this._allCustomers = customers;
        this.adding = false;
      });
    });
  }

  cancelAdd() {
    this.adding = false;
  }

  removeCustomer(customer: RoundCustomerModel) {
    this._service.removeCustomer(this._round.id, customer.id, {}).subscribe(_ => {
      this._customerService.getAllWithNoRound({}).subscribe(customers => {
        Arrays.remove(this.customers, customer);
        this._allCustomers = customers;
      });        
    })
  }
}

export class RoundCustomerModel {
  constructor(
      public id: number,
      public name: string,
      public address: string,
      private _section: RoundCustomersModel) {
  }

  remove() {
    this._section.removeCustomer(this);
  }
}