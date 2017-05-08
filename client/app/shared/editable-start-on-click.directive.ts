import { forwardRef, Inject, Directive, HostListener, Input } from '@angular/core';
import { EditableService } from './editable.service'

@Directive({
  selector: '[cc-editable-start-on-click]'
})
export class EditableStartOnClickDirective {
  @Input()
  key: string

  @Input()
  disabled: boolean

  constructor(
    @Inject(forwardRef(() => EditableService))
    private service: EditableService) {
  }

  @HostListener('click')
  private click(keydown: boolean) {
    if(!this.disabled) {
      this.service.startEdit(this.key);
    }
  }
}