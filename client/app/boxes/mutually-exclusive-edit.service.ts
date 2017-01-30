import {Observable} from 'rxjs/Observable';
import {ReplaySubject} from 'rxjs/ReplaySubject';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

export interface MutuallyExclusiveEditComponent {
  editId: string;
  endEdit(): void;
}

export class MutuallyExclusiveEditService {
  currentlyEditing: MutuallyExclusiveEditComponent = null;

  private _editStart: BehaviorSubject<string> = new BehaviorSubject(null);
  private _editEnd: BehaviorSubject<string> = new BehaviorSubject(null);

  editStart: Observable<string> = this._editStart;
  editEnd: Observable<string> = this._editEnd;

  startEdit(component: MutuallyExclusiveEditComponent) {
    let previouslyEditing = this.currentlyEditing;
    this.currentlyEditing = component;

    if(previouslyEditing && previouslyEditing != component) {
      previouslyEditing.endEdit();
    }
    
    this._editStart.next(component.editId);
  }

  endEdit(component: MutuallyExclusiveEditComponent) {
    if(this.currentlyEditing == component) {
      this.currentlyEditing = null;
      this._editEnd.next(component.editId);    
    }
  }

  endEditByPrefix(editIdPrefix: string) {
    let current = this.currentlyEditing;
    if(current && current.editId.startsWith(editIdPrefix)) {
      current.endEdit();
      this.currentlyEditing = null;
      this._editEnd.next(current.editId);    
    }
  }

  isEditing(component: MutuallyExclusiveEditComponent) {
    return this.currentlyEditing && this.currentlyEditing == component;
  }

  isAnyEditingWithPrefix(editIdPrefix: string) {
    return this.currentlyEditing && this.currentlyEditing.editId.startsWith(editIdPrefix);
  }
}