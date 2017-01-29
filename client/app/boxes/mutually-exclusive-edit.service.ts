export interface MutuallyExclusiveEditComponent {
  editId: string;
  endEdit(): void;
}

export class MutuallyExclusiveEditService {
  currentlyEditing: MutuallyExclusiveEditComponent = null;

  startEdit(component: MutuallyExclusiveEditComponent) {
    let previouslyEditing = this.currentlyEditing;
    this.currentlyEditing = component;

    if(previouslyEditing && previouslyEditing != component) {
      previouslyEditing.endEdit();
    }
  }

  endEdit(component: MutuallyExclusiveEditComponent) {
    if(this.currentlyEditing == component) {
      this.currentlyEditing = null;
    }
  }

  isEditing(component: MutuallyExclusiveEditComponent) {
    return this.currentlyEditing && this.currentlyEditing == component;
  }

  isAnyEditingWithPrefix(editIdPrefix: string) {
    return this.currentlyEditing && this.currentlyEditing.editId.startsWith(editIdPrefix);
  }
}