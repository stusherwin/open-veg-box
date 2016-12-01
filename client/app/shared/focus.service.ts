import {FocusDirective} from './focus.directive';

export class FocusService {
  private focusables: FocusDirective[] = [];

  register(focusable: FocusDirective) {
    this.focusables.push(focusable);
  }

  onFocus(focusable: FocusDirective) {
    var ancestors = this.focusables
      .map(f => { return { f: f, depth: f.getAncestorDepth(focusable) }; })
      .filter(f => f.depth > 0)
      .sort((a, b) => a.depth < b.depth ? -1 : 1)
      .map(f => f.f);

    for(let a of ancestors) {
      let bubble = a.descendentFocus(focusable);
      if(!bubble) {
        break;
      }
    }
  }

  onBlur(focusable: FocusDirective) {
    var ancestors = this.focusables
      .map(f => { return { f: f, depth: f.getAncestorDepth(focusable) }; })
      .filter(f => f.depth > 0)
      .sort((a, b) => a.depth < b.depth ? -1 : 1)
      .map(f => f.f);

    for(let a of ancestors) {
      let bubble = a.descendentBlur(focusable);
      if(!bubble) {
        break;
      }
    }
  }

  blurDescendents(focusable: FocusDirective) {
    var descendents = this.focusables
      .map(f => { return { f: f, depth: focusable.getAncestorDepth(f) }; })
      .filter(f => f.depth > 0)
      .sort((a, b) => a.depth > b.depth ? -1 : 1)
      .map(f => f.f);

    for(let d of descendents) {
      d.beBlurred();
    }
  }
}

class Lookup<K, V> {
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