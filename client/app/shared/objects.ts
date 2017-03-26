export class Objects {
  static extend(obj: {}, extra: {}): any {
    let result = {};

    if(obj) {
      for(let prop in obj) {
        result[prop] = obj[prop];
      }
    }

    if(extra) {
      for(let prop in extra) {
        result[prop] = extra[prop];
      }
    }

    return result;
  }

  static convertPropertyNames(obj: {}, convertFn: (property: string) => string): any {
    let result = {};

    if(obj) {
      for(let prop in obj) {
        result[convertFn(prop)] = obj[prop];
      }
    }

    return result;
  }

  static whiteList(obj: {}, whiteList: any): any {
    if(!obj) {
      return obj;
    }
    
    var result = {};
    var destProps: string[] = whiteList instanceof Array? whiteList : Object.getOwnPropertyNames(whiteList);
    for(var srcProp in obj) {
      if(destProps.indexOf(srcProp) >= 0) {
        var destProp = whiteList instanceof Array? srcProp : whiteList[srcProp];
        result[destProp] = obj[srcProp];
      }
    }

    return result;
  }
}