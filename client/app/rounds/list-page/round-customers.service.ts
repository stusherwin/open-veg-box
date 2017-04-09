import {RoundCustomersComponent} from './round-customers.component'
import {Arrays} from '../../shared/arrays'

export class RoundCustomersService {
  componentMaxWidths: ComponentMaxWidth[] = [];
  maxNameWidth = 0;
  maxAddressWidth = 0;

  deregister(component: RoundCustomersComponent) {
    Arrays.removeWhere(this.componentMaxWidths, c => c.component == component);
  }

  newMaxWidths(component: RoundCustomersComponent, maxNameWidth: number, maxAddressWidth: number) {
    let existing = this.componentMaxWidths.find(c => c.component == component);
    if(!existing) {
      this.componentMaxWidths.push({component, maxNameWidth, maxAddressWidth})
    } else {
      existing.maxNameWidth = maxNameWidth;
      existing.maxAddressWidth = maxAddressWidth;
    }

    let newMaxNameWidth = Math.max(...this.componentMaxWidths.map(c => c.maxNameWidth));
    let newMaxAddressWidth = Math.max(...this.componentMaxWidths.map(c => c.maxAddressWidth));
 
    if(newMaxNameWidth != this.maxNameWidth || newMaxAddressWidth != this.maxAddressWidth) {
      this.maxNameWidth = newMaxNameWidth;
      this.maxAddressWidth = newMaxAddressWidth;
 
      for(let c of this.componentMaxWidths) {
        c.component.newMaxWidths(this.maxNameWidth, this.maxAddressWidth);
      }
    } else if(!existing) {
      component.newMaxWidths(this.maxNameWidth, this.maxAddressWidth);
    }
  }
}

interface ComponentMaxWidth {
  component: RoundCustomersComponent;
  maxNameWidth: number;
  maxAddressWidth: number;
}