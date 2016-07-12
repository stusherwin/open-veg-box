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