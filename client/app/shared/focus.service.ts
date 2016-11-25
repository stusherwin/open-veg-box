import {FocusDirective} from './focus.directive';

export class FocusService {
  private focusables: FocusDirective[] = [];
  private ancestorLookup: Lookup<FocusDirective, FocusDirective[]> = new Lookup<FocusDirective, FocusDirective[]>();

  register(focusable: FocusDirective) {
    this.focusables.push(focusable);
  }

  focus(element: FocusDirective) {
    var ancestors = this.focusables
      .map(f => { return { f: f, depth: f.getAncestorDepth(element) }; })
      .filter(f => f.depth > 0)
      .sort((a, b) => a.depth < b.depth ? -1 : 1)
      .map(f => f.f);

    this.ancestorLookup.set(element, ancestors);
    for(let a of ancestors) {
      let bubble = a.descendentFocus();
      if(!bubble) {
        break;
      }
    }
  }

  blur(element: FocusDirective) {
    var ancestors = this.ancestorLookup.get(element);
    for(let a of ancestors) {
      let bubble = a.descendentBlur();
      if(!bubble) {
        break;
      }
    }

    this.ancestorLookup.remove(element);
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