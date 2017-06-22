import { Subject } from 'rxjs/Subject'
import { Observable } from 'rxjs/Observable'

export class EditableService {
  private _currentlyEditing: string;
  private _currentlyEditingSubject = new Subject<string>();

  get currentlyEditing(): Observable<string> {
    return this._currentlyEditingSubject;
  }

  startEdit(key: string) {
    if(key != this._currentlyEditing) {
      this._currentlyEditing = key;
      this._currentlyEditingSubject.next(key);
    }
  }
}