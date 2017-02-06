import {Inject, forwardRef} from '@angular/core';
import {FocusDirective} from './focus.directive';
import {ClickOutsideService, IHandleOutsideClick} from './click-outside.service';
import {Arrays} from './arrays';
import {Lookup} from './lookup';

export class FocusService implements IHandleOutsideClick {
  focusables: FocusDirective[] = [];
  focusablesByDepth: {[depth: number]: FocusDirective[]} = { 0: [] };
  maxDepth: number = 0;
  private outsideClickFocusables: FocusDirective[] = [];

  constructor(
    @Inject(forwardRef(() => ClickOutsideService))
    private clickOutsideService: ClickOutsideService) {
      this.clickOutsideService.register(this);
  }
  
  register(focusable: FocusDirective, handleOutsideClick: boolean) {
    this.focusables.push(focusable);
    if(handleOutsideClick) {
      this.outsideClickFocusables.push(focusable);
    }

    for(let d = this.maxDepth; d >= 0; d--) {
      if(!this.focusablesByDepth[d]) {
        continue;
      }

      let foundParent = false;
      for(let f of <FocusDirective[]>this.focusablesByDepth[d]) {
        let depth = f.getAncestorDepth(focusable);
        if(depth > 0) {
          f.addChild(focusable);
          let newDepth = d + depth;
          if(newDepth > this.maxDepth) {
            this.maxDepth = newDepth;
          }
          if(!this.focusablesByDepth[newDepth]) {
            this.focusablesByDepth[newDepth] = [focusable];
          } else {
            this.focusablesByDepth[newDepth].push(focusable);
          }
          foundParent = true;
          break;
        }
      }

      if(foundParent) {
        break;
      }
      
      if(d == 0) {
        this.focusablesByDepth[0].push(focusable);
      }
    }
  }

  deregister(focusable: FocusDirective) {
    Arrays.remove(this.focusables, focusable);
    Arrays.remove(this.outsideClickFocusables, focusable);
    
    for(let d = this.maxDepth; d >= 0; d--) {
      if(!this.focusablesByDepth[d]) {
        continue;
      }
      let focusables = <FocusDirective[]>this.focusablesByDepth[d]; 
      if(focusables.find(f => f == focusable)) {
        Arrays.remove(focusables, focusable);
      }
    }

    if(focusable.parent) {
      focusable.parent.removeChild(focusable);
    }
  }

  outsideClick(x: number, y: number) {
    for(let f of this.outsideClickFocusables) {
      f.outsideClick(x, y);
    }
  }
}