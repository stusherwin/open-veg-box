export class Arrays {
  static remove<T>(arr: T[], item: T) {
    let index = arr.findIndex(i => i == item);
    if(index >= 0) {
      arr.splice(index, 1);
    }
  }

  static removeWhere<T>(arr: T[], predicate: (value: T) => boolean) {
    let index = arr.findIndex(predicate);
    if(index >= 0) {
      arr.splice(index, 1);
    }
  }

  static except<T>(a: T[], b: T[]): T[] {
    let result: T[] = [];
    for(let ai of a) {
      if(!b.find(bi => bi == ai)) {
        result.push(ai);
      }
    }
    return result;
  }

  static exceptBy<T, K>(a: T[], b: T[], key: (value: T) => K): T[] {
    let result: T[] = [];
    for(let ai of a) {
      if(!b.find(bi => key(bi) == key(ai))) {
        result.push(ai);
      }
    }
    return result;
  }

  static exceptByOther<T, U, K>(a: T[], aKey: (value: T) => K, b: U[], bKey: (value: U) => K): T[] {
    let result: T[] = [];
    for(let ai of a) {
      if(!b.find(bi => bKey(bi) == aKey(ai))) {
        result.push(ai);
      }
    }
    return result;
  }
}