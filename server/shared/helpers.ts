export let wl = function(props: any, obj: any): any {
  return makeWl(props)(obj);
}

export let makeWl = function(props: any): (o:any) => any {
  return function(obj: any) {
    if(!obj) {
      return obj;
    }
    
    var result = {};
    var destProps: string[] = props instanceof Array? props : Object.getOwnPropertyNames(props);
    for(var srcProp in obj) {
      if(destProps.indexOf(srcProp) >= 0) {
        var destProp = props instanceof Array? srcProp : props[srcProp];
        result[destProp] = obj[srcProp];
      }
    }
    return result;
  }
}