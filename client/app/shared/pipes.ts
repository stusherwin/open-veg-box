import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
import { DateString } from './dates'

@Pipe({name: 'money'})
export class MoneyPipe implements PipeTransform {
  transform(value: number, forcePounds: boolean): string {
    return forcePounds || (value || 0) >= 1
      ? '&pound;' + value.toFixed(2)
      : ((value || 0) * 100).toFixed(0) + 'p';
  }
}

@Pipe({name: 'weight'})
export class WeightPipe implements PipeTransform {
  transform(value: number): string {
    return (value || 0) < 1 ? ((value || 0) * 1000).toFixed(0) + ' g' : value + ' Kg';
  }
}

//TODO: this is obsolete - delete
@Pipe({name: 'quantity'})
export class QuantityPipe implements PipeTransform {
  transform(value: any): string {
    if(value && value.unitType == 'perKg') {
      return (value.quantity < 1 ? (value.quantity * 1000).toFixed(0) + 'g' : value.quantity + ' Kg');
    } else if(value && value.unitType == 'each') {
      return 'x ' + value.quantity;
    } else {
      return 'nope.';
    }
  }
}

@Pipe({name: 'singleLine'})
export class SingleLinePipe implements PipeTransform {
  transform(value: string, separator: string): string {
    if(!value) {
      return '';
    }
    
    return value.split(/[\r\n]+/g).map(l => '<span style="white-space: nowrap">' + l + '</span>').join( separator );
  }
}

@Pipe({name: 'preserveLines'})
export class PreserveLinesPipe implements PipeTransform {
  transform(value: string): string {
    if(!value) {
      return '';
    }
    
    return value.replace(/\n/g, '<br />');
  }
}

@Pipe({name: 'defaultTo'})
export class DefaultToPipe implements PipeTransform {
  transform(value: string, defaultValue: string): string {
    if(!value) {
      return defaultValue;
    }

    return value.replace(/\s/g, '').length ? value : defaultValue;
  }
}

@Pipe({name: 'dateString'})
export class DateStringPipe implements PipeTransform {
  transform(value: DateString): string {
    if(!value) {
      return '';
    }

    return new DatePipe().transform(value.toDate(), 'yMMMEEEEd');
  }
}

@Pipe({name: 'count'})
export class CountPipe implements PipeTransform {
  transform(value: number, itemName: string = 'item', zeroText?: string): string {
    let result = (value || 0) + ''
    if(result == '0' && zeroText) {
      result = zeroText;
    }
    result += ' ' + itemName;

    if(value != 1) {
      if(result.endsWith('s') || result.endsWith('x') || result.endsWith('sh')) {
        result += 'es'
      } else {
        result += 's';
      }
    }

    return result;
  }
}