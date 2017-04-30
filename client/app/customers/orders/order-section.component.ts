import { Component, Input, Output, EventEmitter, ViewChild, forwardRef, Inject, ElementRef, OnInit, Renderer, ViewChildren, QueryList, Directive, HostListener, HostBinding, AfterViewInit, ContentChildren } from '@angular/core';
import { ActiveElementDirective, ActivateOnFocusDirective, DeactivateOnBlurDirective } from '../../shared/active-elements'
import { DistributeWidthDirective, DistributeWidthSumDirective } from '../../shared/distribute-width.directive'
import { OrderItemQuantityComponent } from './order-item-quantity.component'
import { EditableValueComponent } from '../../shared/editable-value.component'
import { Arrays } from '../../shared/arrays'
import { NumericDirective } from '../../shared/numeric.directive'
import { MoneyPipe } from '../../shared/pipes'
import { OrderModel, OrderAvailableItem } from './order.model'
import { OrderSectionModel } from './order-section.model'
import { OrderItemModel } from './order-item.model'
import { ProductQuantityComponent } from '../../products/product-quantity.component'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { Subject } from 'rxjs/Subject'
import { Observable } from 'rxjs/Observable'
import 'rxjs/add/operator/distinct'

@Component({
  template: `
    <a class="button-new-small"
      cc-active cc-activate-on-focus cc-deactivate-on-blur
      (click)="edit()" (keydown.Enter)="edit()"
      [tabindex]="tabindex"><i class="icon-{{icon}}"></i>
    </a>
  `,
  selector: 'cc-editable-button',
  directives: [ActiveElementDirective, ActivateOnFocusDirective, DeactivateOnBlurDirective]
})
export class EditableEditButtonComponent implements OnInit {
  visible: boolean;

  @Input()
  key: string

  @Input()
  icon: string

  @Input()
  tabindex: number = 9999

  constructor(
    @Inject(forwardRef(() => EditableService))
    private service: EditableService) {
  }

  edit() {
    this.service.startEdit(this.key);
  }

  ngOnInit() {
    this.service.currentlyEditing
      .subscribe(key => {
        this.visible = key != this.key;
      });
  }
}

@Component({
  template: `
    <span cc-active (deactivate)="onDeactivate()">
      <a class="button-new-small"
        cc-active cc-activate-on-focus cc-deactivate-on-blur
        (click)="ok()" (keydown.Enter)="ok()"
        (focus)="onButtonFocus()"
        (keydown.Tab)="service.handleTab($event.shiftKey)"
        [tabindex]="9999"><i class="icon-ok"></i>
      </a>
      <a class="button-new-small"
        cc-active cc-activate-on-focus cc-deactivate-on-blur
        (click)="cancel()" (keydown.Enter)="cancel()"
        (focus)="onButtonFocus()"
        (keydown.Tab)="service.handleTab($event.shiftKey)"
        [tabindex]="9999"><i class="icon-cancel"></i>
      </a>
    </span>
  `,
  selector: 'cc-editable-buttons',
  directives: [ActiveElementDirective, ActivateOnFocusDirective, DeactivateOnBlurDirective]
})
export class EditableButtonsComponent implements OnInit {
  visible: boolean;

  @Input()
  key: string

  constructor(
    @Inject(forwardRef(() => EditableService))
    private service: EditableService) {
  }

  ngOnInit() {
    this.service.currentlyEditing
      .subscribe(key => {
        this.visible = key == this.key;
      });
  }

  ok() {
    this.service.endEdit(this.key, true);
  }

  cancel() {
    this.service.endEdit(this.key, false);
  }

  onButtonFocus() {
    this.service.preventEndEdit(this.key);
  }

  onDeactivate() {
    this.service.tryEndEdit(this.key);
  }
}

export class InputComponent {
  isValid: boolean;
  validate(): boolean {
    console.log('parent.validate()')
    return true;
  }
}

@Component({
  template: `
    <span class="input-wrapper" [class.invalid]="!isValid">
      <input type="text" class="{{cssClass}}"
            cc-active cc-activate-on-focus
            [(ngModel)]="editingValue"
            (ngModelChange)="editingValueChange.emit($event)"
            (focus)="onInputFocus()"
            (blur)="onInputBlur()"
            (keydown.Tab)="service.handleTab($event.shiftKey)"
            tabindex="1" />
      <i *ngIf="!isValid" class="icon-warning" title="{{message}}"></i>
    </span>
  `,
  selector: 'cc-text',
  directives: [ActiveElementDirective, ActivateOnFocusDirective]
})
export class TextComponent extends InputComponent implements OnInit {
  editingValue: string;
  isValid: boolean = true;

  @Input()
  key: string

  @Input()
  cssClass: string;

  @Input()
  value: string;

  @Input()
  firstInput: boolean;

  @Input()
  valid: string

  @Input()
  message: string

  @ViewChild('input')
  input: ElementRef;

  @Output()
  valueChange = new EventEmitter<string>()

  @Output()
  editingValueChange = new EventEmitter<string>()

  constructor(
    @Inject(forwardRef(() => EditableService))
    private service: EditableService,
    private renderer: Renderer) {
      super();
  }

  onInputFocus() {
    this.service.startEdit(this.key);
  }

  onInputBlur() {
    this.service.tryEndEdit(this.key);
  }

  ngOnInit() {
    this.editingValue = this.value;

    this.service.ok
      .filter(key => key == this.key)
      .subscribe(key => {
        this.value = this.editingValue;
        this.editingValue = this.value;
        this.editingValueChange.emit(this.value);
        this.valueChange.emit(this.value);
        this.isValid = true;
      });

    this.service.cancel
      .filter(key => key == this.key)
      .subscribe(key => {
        this.editingValue = this.value;
        this.editingValueChange.emit(this.value);
        this.isValid = true;
      });

    if(this.firstInput) {
      this.service.currentlyEditing
        .subscribe(key => {
          if(key == this.key) {
            setTimeout(this.renderer.invokeElementMethod(this.input.nativeElement, 'focus', []));
          }
        });
    }
  }

  validate(): boolean {
    let $value = this.editingValue;
    this.isValid = eval(this.valid);
    return this.isValid;
  }
}

@Component({
  template: `
    <span class="input-wrapper" [class.invalid]="!isValid">
      <input #input type="text" class="{{cssClass}}"
            cc-active cc-activate-on-focus
            [(ngModel)]="editingValue"
            (ngModelChange)="editingValueChange.emit(toDecimalValue($event))"
            (focus)="onInputFocus()"
            (blur)="onInputBlur()"
            (keydown.Tab)="service.handleTab($event.shiftKey)"
            tabindex="1" />
      <i *ngIf="!isValid" class="icon-warning" title="{{message}}"></i>
    </span>
  `,
  selector: 'cc-number',
  directives: [ActiveElementDirective, ActivateOnFocusDirective]
})
export class NumberComponent extends InputComponent implements OnInit {
  editingValue: string;
  isValid: boolean = true;

  @Input()
  key: string

  @Input()
  cssClass: string;

  @Input()
  value: number;

  @Input()
  fixedDecimals: boolean = false;

  @Input()
  decimalPrecision: number;

  @Input()
  firstInput: boolean

  @Input()
  valid: string

  @Input()
  message: string

  @ViewChild('input')
  input: ElementRef;

  @Output()
  valueChange = new EventEmitter<number>()

  @Output()
  editingValueChange = new EventEmitter<number>()

  constructor(
    @Inject(forwardRef(() => EditableService))
    private service: EditableService,
    private renderer: Renderer) {
      super();
  }

  ngOnInit() {
    this.editingValue = this.toStringValue(this.value);

    this.service.ok
      .filter(key => key == this.key)
      .subscribe(key => {
        this.value = this.toDecimalValue(this.editingValue);
        this.editingValue = this.toStringValue(this.value);
        this.editingValueChange.emit(this.value);
        this.valueChange.emit(this.value);
        this.isValid = true;
      });

    this.service.cancel
      .filter(key => key == this.key)
      .subscribe(key => {
        this.editingValue = this.toStringValue(this.value);
        this.editingValueChange.emit(this.value);
        this.isValid = true;
      });

    if(this.firstInput) {
      this.service.currentlyEditing
        .subscribe(key => {
          if(key == this.key) {
            setTimeout(this.renderer.invokeElementMethod(this.input.nativeElement, 'focus', []));
          }
        });
    }
  }

  onInputFocus() {
    this.service.startEdit(this.key);
  }

  onInputBlur() {
    this.service.tryEndEdit(this.key);
  }

  validate(): boolean {
    console.log('child.validate()')
    let $value = this.toDecimalValue(this.editingValue);
    this.isValid = eval(this.valid);
    console.log('valid: ' + this.isValid);
    return this.isValid;
  }

  private toStringValue(value: number): string {
    if(this.fixedDecimals) {
      return value.toFixed(this.decimalPrecision);
    }

    var result = value.toFixed(this.decimalPrecision);
    while (result !== '0' && (result.endsWith('.') || (result.indexOf('.') != -1 && result.endsWith('0')))) {
      result = result.substring(0, result.length - 1);
    }
    return result;
  }

  private toDecimalValue(value: string): number {
    var parsed = parseFloat(value);
    if( isNaN(parsed) ) {
      return 0;
    }

    return parseFloat(parsed.toFixed(this.decimalPrecision));
  }
}

@Directive({
  selector: '[cc-editable-display]'
})
export class EditableDisplayDirective implements OnInit {
  @Input('cc-editable-display')
  key: string;

  @HostBinding('class.off-screen')
  hidden: boolean = false;

  constructor(
    @Inject(forwardRef(() => EditableService))
    private service: EditableService) {
  }

  ngOnInit() {
    this.service.currentlyEditing
      .subscribe(key => {
        this.hidden = key == this.key;
      });
  }
}

@Component({
  selector: 'cc-editable-edit-form',
  template: '<ng-content></ng-content>'
})
export class EditableEditFormComponent implements OnInit, AfterViewInit {
  @Input()
  key: string;

  @ContentChildren('input')
  inputs: QueryList<InputComponent>

  @HostBinding('class.off-screen')
  hidden: boolean = true;

  @HostListener('keydown.Enter')
  enter() {
    console.log('enter()')
    this.service.endEdit(this.key, true);
  }

  @HostListener('keydown.Escape')
  escape() {
    console.log('escape()')
    this.service.endEdit(this.key, false);
  }

  constructor(
    @Inject(forwardRef(() => EditableService))
    private service: EditableService) {
  }

  ngOnInit() {
    this.service.currentlyEditing
      .subscribe(key => {
        this.hidden = key != this.key;
      });
  }

  ngAfterViewInit() {
    let inputs = this.inputs.toArray();
    console.log(inputs);
    this.service.registerValidate(this.key, () => {
      return this.validate();
    });
  }

  validate(): boolean {
    console.log(this.inputs);
    console.log(this.inputs.toArray());
    this.inputs.forEach(i => i.validate());
    let valid = this.inputs.reduce((valid, i) => valid && i.isValid, true);
    console.log('valid: ' + valid);
    return valid;
  }
}

@Directive({
  selector: '[cc-editable-edit]'
})
export class EditableEditDirective implements OnInit {
  @Input('cc-editable-edit')
  key: string;

  @HostBinding('class.off-screen')
  hidden: boolean = true;

  constructor(
    @Inject(forwardRef(() => EditableService))
    private service: EditableService) {
  }

  ngOnInit() {
    this.service.currentlyEditing
      .subscribe(key => {
        this.hidden = key != this.key;
      });
  }
}

@Directive({
  selector: '[cc-editable-background]'
})
export class EditableBackgroundDirective implements OnInit {
  @Input('cc-editable-background')
  key: string;

  @HostBinding('class.editable-background')
  editing: boolean = false;

  constructor(
    @Inject(forwardRef(() => EditableService))
    private service: EditableService) {
  }

  ngOnInit() {
    this.service.currentlyEditing
      .subscribe(key => {
        this.editing = key == this.key;
      });
  }
}


@Directive({
  selector: '[cc-editable-first-input]'
})
export class EditableFirstInputDirective implements OnInit {
  @Input('cc-editable-first-input')
  key: string;

  @HostListener('focus')
  focus() {
    this.service.startEdit(this.key);
  }

  constructor(
    private el: ElementRef,
    @Inject(forwardRef(() => EditableService))
    private service: EditableService,
    private renderer: Renderer) {
  }

  ngOnInit() {
    this.service.currentlyEditing
      .subscribe(key => {
        if(key == this.key) {
          setTimeout(this.renderer.invokeElementMethod(this.el.nativeElement, 'focus', []));
        }
      });
  }
}

@Component({
  selector: '[cc-order-section]',
  templateUrl: 'app/customers/orders/order-section.component.html',
  directives: [ActiveElementDirective, ActivateOnFocusDirective, DeactivateOnBlurDirective, DistributeWidthDirective, OrderItemQuantityComponent, DistributeWidthSumDirective, EditableValueComponent, NumericDirective, ProductQuantityComponent, EditableDisplayDirective, EditableEditDirective, EditableEditButtonComponent, EditableButtonsComponent, EditableBackgroundDirective, EditableFirstInputDirective, TextComponent, NumberComponent, EditableEditFormComponent],
  pipes: [MoneyPipe]
})
export class OrderSectionComponent implements OnInit {
  orderItemPadding = 10;
  quantity: number = 1;
  itemNameArticle: string;

  @Input()
  model: OrderSectionModel

  @Input()
  heading: string;

  @Input()
  itemName: string;

  @ViewChild('add')
  addBtn: ElementRef;

  @ViewChild('select')
  select: ElementRef;

  @ViewChild('editable')
  editable: EditableValueComponent

  @ViewChildren('remove')
  removeBtns: QueryList<ElementRef>

  constructor(private renderer: Renderer) {
  }

  ngOnInit() {
    this.itemNameArticle = /^[aeiou]/i.test(this.itemName) ? 'an' : 'a';
  }

  onOrderItemRemove(item: OrderItemModel, keyboard: boolean) {
    let index = this.model.items.findIndex(i => i == item);
    item.remove();
    if(keyboard) {
      if(this.model.items.length) {
        setTimeout(() => {
          let nextRemoveFocusIndex = Math.min(index, this.model.items.length - 1);
          let nextFocusBtn = this.removeBtns.toArray()[nextRemoveFocusIndex];
          this.renderer.invokeElementMethod(nextFocusBtn.nativeElement, 'focus', [])
        })
      } else if(this.model.itemsAvailable.length) {
        setTimeout(() => this.renderer.invokeElementMethod(this.addBtn.nativeElement, 'focus', []))
      }
    } else {
      if(this.model.items.length) {
        let nextRemoveFocusIndex = Math.min(index, this.model.items.length - 1);
        let nextFocusBtn = this.removeBtns.toArray()[nextRemoveFocusIndex];
        this.renderer.invokeElementMethod(nextFocusBtn.nativeElement, 'blur', [])
      }
    }
 }

  onAddStart() {
    this.renderer.invokeElementMethod(this.select.nativeElement, 'focus', []);
    this.model.startAdd();
  }

  onAddOk(tabbedAway: boolean) {
    if(tabbedAway && this.model.itemsAvailable.length > 1) {
      setTimeout(() => this.renderer.invokeElementMethod(this.addBtn.nativeElement, 'focus', []))
    }

    this.model.add();
    this.editable.endEdit();
  }

  onAddCancel() {
    this.model.cancelAdd();
    this.editable.endEdit();
  }

  onAddingItemQuantityChange(quantity: number) {
    this.model.recalculateTotal();
  }

  getItemId(item: OrderItemModel) {
    return item.id;
  }
}

export class EditableService {
  private currentKey: string = null;
  private currentlyEditingSubject = new BehaviorSubject<string>(null);
  private okSubject = new BehaviorSubject<string>(null);
  private cancelSubject = new BehaviorSubject<string>(null);
  private validates: {[key: string]: () => boolean} = {};

  get currentlyEditing(): Observable<string> {
    return this.currentlyEditingSubject;
  }

  get ok(): Observable<string> {
    return this.okSubject;
  }

  get cancel(): Observable<string> {
    return this.cancelSubject;
  }

  registerValidate(key: string, validate: () => boolean) {
    this.validates[key] = validate;
  }

  startEdit(key: string) {
    this.preventEndEdit(key);
    this.currentKey = key;
    this.currentlyEditingSubject.next(key);
  }

  private _tabbingAway = false;

  handleTab(shiftKey: boolean) {
    // this._tabbedAway = false;
    if(!shiftKey) {
      this._tabbingAway = true;
      // If user tabs away from this component and is blocked due to validation,
      // we don't want to block them clicking away just because they tabbed away originally
      setTimeout(() => this._tabbingAway = false, 100);
    }
  }

  currentlyTryingToEnd: string;
  tryEndEdit(key: string) {
    this.currentlyTryingToEnd = key;
    let tabbedAway = this._tabbingAway;
    setTimeout(() => {
      if(this.currentlyTryingToEnd && this.currentlyTryingToEnd == key) {
        this.endEdit(key, tabbedAway);
      }
    }, 100)
  }

  preventEndEdit(key: string) {
    if(this.currentlyTryingToEnd == key) {
      this.currentlyTryingToEnd = null;
    }
  }

  endEdit(key: string, ok: boolean) {
    if(this.currentlyTryingToEnd == key) {
      this.currentlyTryingToEnd = null;
    }
    if(ok) {
      let valid = this.validates[key]();
      if(valid) {
        this.okSubject.next(key);
        if(this.currentKey == key) {
          this.currentKey = null;
          this.currentlyEditingSubject.next(null);
        }
      } else {
        this.currentlyEditingSubject.next(key);
        // this.cancelSubject.next(key);
      }
    } else {
      this.cancelSubject.next(key);
      if(this.currentKey == key) {
        this.currentKey = null;
        this.currentlyEditingSubject.next(null);
      }
    }
  }
}