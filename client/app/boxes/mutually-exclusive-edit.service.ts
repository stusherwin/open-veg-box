import { EventEmitter } from '@angular/core'

export interface MutuallyExclusiveEditComponent {
  editId: string;
  endEdit(): void;
}

export class MutuallyExclusiveEditService {
  currentlyEditing: MutuallyExclusiveEditComponent = null;
  editStart = new EventEmitter<any>() 
  editEnd = new EventEmitter<any>() 

  startEdit(component: MutuallyExclusiveEditComponent) {
    let previouslyEditing = this.currentlyEditing;
    this.currentlyEditing = component;

    if(previouslyEditing && previouslyEditing != component) {
      previouslyEditing.endEdit();
    }
    this.editStart.emit(null);
  }

  endEdit(component: MutuallyExclusiveEditComponent) {
    if(this.currentlyEditing == component) {
      this.currentlyEditing = null;
    }
    this.editEnd.emit(null);    
  }

  isEditing(component: MutuallyExclusiveEditComponent) {
    return this.currentlyEditing && this.currentlyEditing == component;
  }

  isAnyEditingWithPrefix(editIdPrefix: string) {
    return this.currentlyEditing && this.currentlyEditing.editId.startsWith(editIdPrefix);
  }
}