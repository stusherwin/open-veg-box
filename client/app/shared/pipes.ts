import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'money'})
export class MoneyPipe implements PipeTransform {
  transform(value: number): string {
    return value < 1 ? (value * 100).toFixed(0) + 'p' : '&pound;' + value.toFixed(2);
  }
}

@Pipe({name: 'weight'})
export class WeightPipe implements PipeTransform {
  transform(value: number): string {
    return value < 1 ? (value * 1000).toFixed(0) + 'g' : value + ' Kg';
  }
}

@Pipe({name: 'quantity'})
export class QuantityPipe implements PipeTransform {
  transform(value: any): string {
    if(value.unitType == 'perKg') {
      return value.quantity < 1 ? (value.quantity * 1000).toFixed(0) + 'g' : value.quantity + ' Kg';
    } else if(value.unitType == 'each') {
      return 'x ' + value.quantity;
    } else {
      return 'nope.';
    }
  }
}

@Pipe({name: 'singleline'})
export class SingleLinePipe implements PipeTransform {
  transform(value: string, separator: string): string {
    return value.split(/[\r\n]+/g).map(l => '<span style="white-space: nowrap">' + l + '</span>').join( separator );
  }
}

@Pipe({name: 'preservelines'})
export class PreserveLinesPipe implements PipeTransform {
  transform(value: string): string {
    return value.replace(/\n/g, '<br />');
  }
}