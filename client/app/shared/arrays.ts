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
}