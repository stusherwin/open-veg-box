import { Component } from '@angular/core';

export class Product {
  constructor(name:string, price:number) {
    this.name = name;
    this.price = price;
  }
    
  name: string;
  price: number;
}

@Component({
  selector: 'cc-products',
  styleUrls: ['app/products/products.component.css'],
  templateUrl: 'app/products/products.component.html'
})
export class ProductsComponent {
  products: Product[] = [
    new Product("Carrots", 1.2),
    new Product("Garlic (bulb)", 0.7)
  ];
}