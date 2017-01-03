export class Lookup<K, V> {
  private pairs: Pair<K, V>[] = [];
  get(key: K): V {
    var p = this.pairs.find(p => p.key == key);
    if(!p){
      return undefined;
    }
    return p.value;
  }

  set(key: K, value: V) {
    var p = this.pairs.find(p => p.key == key);
    if(!p){
      this.pairs.push(new Pair(key, value));
    } else {
      p.value = value;
    }
  }

  remove(key: K) {
    var i = this.pairs.findIndex(p => p.key == key);
    if(i >=0){
      this.pairs.splice(i, 1);
    }
  }
}

class Pair<K,V> {
  key: K;
  value: V;

  constructor(key: K, value: V) {
    this.key = key;
    this.value = value; 
  }
}