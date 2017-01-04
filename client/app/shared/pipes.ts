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