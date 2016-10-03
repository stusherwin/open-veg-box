export class Round {
  constructor(id: number, name:string) {
    this.id = id;
    this.name = name;
  }
    
  id: number;
  name: string;

  clone() {
    return new Round(this.id, this.name);
  }
}