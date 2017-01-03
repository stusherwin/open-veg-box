import {Inject, forwardRef} from '@angular/core';
import {FocusDirective} from './focus.directive';
import {ClickOutsideService, IHandleOutsideClick} from './click-outside.service';
import {Arrays} from './arrays';
import {Lookup} from './lookup';

export class FocusService implements IHandleOutsideClick {
  private focusables: FocusDirective[] = [];
  private outsideClickFocusables: FocusDirective[] = [];

  constructor(
    @Inject(forwardRef(() => ClickOutsideService))
    private clickOutsideService: ClickOutsideService) {
  }

  register(focusable: FocusDirective, handleOutsideClick: boolean) {
    this.focusables.push(focusable);
    if(handleOutsideClick) {
      this.outsideClickFocusables.push(focusable);
      this.clickOutsideService.register(this);
    }
  }

  deregister(focusable: FocusDirective) {
    Arrays.remove(this.focusables, focusable);
    Arrays.remove(this.outsideClickFocusables, focusable);
  }

  onFocus(focusable: FocusDirective) {
    var ancestors = this.focusables
      .map(f => { return { f: f, depth: f.getAncestorDepth(focusable) }; })
      .filter(f => f.depth > 0)
      .sort((a, b) => a.depth < b.depth ? -1 : 1)
      .map(f => f.f);

    let nearestAncestor = ancestors.length? ancestors[0] : null;
    if(nearestAncestor) {
      nearestAncestor.descendentFocus(focusable);
    }
  }

  onBlur(focusable: FocusDirective) {
    var ancestors = this.focusables
      .map(f => { return { f: f, depth: f.getAncestorDepth(focusable) }; })
      .filter(f => f.depth > 0)
      .sort((a, b) => a.depth < b.depth ? -1 : 1)
      .map(f => f.f);

    let nearestAncestor = ancestors.length? ancestors[0] : null;
    if(nearestAncestor) {
      let bubble = nearestAncestor.descendentBlur(focusable);
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

  outsideClick(x: number, y: number) {
    for(let f of this.outsideClickFocusables) {
      if(f.focused && f.isOutside(x, y)) {
        f.beBlurred();
      }
    }
  }
}