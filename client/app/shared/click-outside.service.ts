import {Arrays} from './arrays';

export interface IHandleOutsideClick {
  outsideClick(x: number, y: number): void;  
}

export class ClickOutsideService {
  private handlers: IHandleOutsideClick[] = [];

  register(handler: IHandleOutsideClick) {
    this.handlers.push(handler);
  }

  deregister(handler: IHandleOutsideClick) {
    Arrays.remove(this.handlers, handler);
  }

  outsideClick(x: number, y: number) {
    for(let h of this.handlers) {
      h.outsideClick(x, y);
    }
  }
}