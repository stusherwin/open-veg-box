export class Delivery {
  constructor(id: number, name:string) {
    this.id = id;
    this.name = name;
  }
    
  id: number;
  name: string;

  clone() {
    return new Delivery(this.id, this.name);
  }
}