export interface MutuallyExclusiveEditComponent {
  cancelEdit(): void;
}

export class MutuallyExclusiveEditService {
  currentlyEditing: MutuallyExclusiveEditComponent = null;

  endEdit() {
    this.currentlyEditing = null;
  }

  startEdit(component: MutuallyExclusiveEditComponent) {
    if(this.currentlyEditing) {
      this.currentlyEditing.cancelEdit();
    }

    this.currentlyEditing = component;
  }
}