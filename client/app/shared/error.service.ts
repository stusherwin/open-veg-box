import {Observable} from 'rxjs/Observable';
import {ReplaySubject} from 'rxjs/ReplaySubject';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

const AUTO_HIDE: boolean = false;
const AUTO_HIDE_TIME: number = 10000;

export class ErrorService {
  private _error: BehaviorSubject<any> = new BehaviorSubject(null);
  private _timeout: any;

  error: Observable<any> = this._error;

  constructor() {
  }

  raiseError(error: any) {
    this._error.next(error);
    
    if(this._timeout) {
      clearTimeout(this._timeout);
    }

    if(AUTO_HIDE) {
      this._timeout = setTimeout(() => {
        this._error.next(null)
      }, AUTO_HIDE_TIME);
    }
  }

  dismissError() {
    if(this._timeout) {
      clearTimeout(this._timeout);
    }
    this._error.next(null);
  }
}