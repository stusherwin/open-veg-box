import {BoxProductsComponent} from './box-products.component'
import {Arrays} from '../shared/arrays'

export class BoxProductsService {
  componentMaxWidths: ComponentMaxWidth[] = [];
  maxNameWidth = 0;
  maxQuantityWidth = 0;
  private activeEditId: string

  deregister(component: BoxProductsComponent) {
    Arrays.removeWhere(this.componentMaxWidths, c => c.component == component);
  }

  newMaxWidths(component: BoxProductsComponent, maxNameWidth: number, maxQuantityWidth: number) {
    let existing = this.componentMaxWidths.find(c => c.component == component);
    if(!existing) {
      this.componentMaxWidths.push({component, maxNameWidth, maxQuantityWidth})
    } else {
      existing.maxNameWidth = maxNameWidth;
      existing.maxQuantityWidth = maxQuantityWidth;
    }

    let newMaxNameWidth = Math.max(...this.componentMaxWidths.map(c => c.maxNameWidth));
    let newMaxQuantityWidth = Math.max(...this.componentMaxWidths.map(c => c.maxQuantityWidth));
 
    if(newMaxNameWidth != this.maxNameWidth || newMaxQuantityWidth != this.maxQuantityWidth) {
      this.maxNameWidth = newMaxNameWidth;
      this.maxQuantityWidth = newMaxQuantityWidth;
 
      for(let c of this.componentMaxWidths) {
        c.component.recalculateColumnWidths(this.maxNameWidth, this.maxQuantityWidth);
      }
    } else if(!existing) {
      component.recalculateColumnWidths(this.maxNameWidth, this.maxQuantityWidth);
    }
  }

  setActive(editId: string) {
    this.activeEditId = editId;
  }

  setInactive(editId: string) {
    if(this.activeEditId == editId) {
      this.activeEditId = null;
    }
  }

  isActive(editId: string) {
    return this.activeEditId == editId;
  }
}

interface ComponentMaxWidth {
  component: BoxProductsComponent;
  maxNameWidth: number;
  maxQuantityWidth: number;
}