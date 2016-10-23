import {HighlightableDirective} from './highlightable.directive';

export class HighlightService {
  private highlightable: HighlightableDirective[] = [];
  private parents: Lookup<HTMLElement, HighlightableDirective> = new Lookup<HTMLElement, HighlightableDirective>();

  registerHighlightable(highlightable: HighlightableDirective) {
    this.highlightable.push(highlightable);
  }

  highlight(childElement: HTMLElement) {
    var h = this.highlightable.find(h => h.isAncestorOf(childElement));
    this.parents.put(childElement, h);
    
    if(h) {
      h.highlight();
    }
  }

  unHighlight(childElement: any) {
    var h = this.parents.get(childElement);
    
    if(h) {
      h.unHighlight();
    }

    this.parents.remove(childElement);
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
  put(key: K, value: V) {
    this.pairs.push(new Pair(key, value));
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