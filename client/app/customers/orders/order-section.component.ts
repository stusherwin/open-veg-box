import { Component, Input, Output, EventEmitter, ViewChild, forwardRef, Inject, ElementRef, OnInit, Renderer, ViewChildren, QueryList, Directive, HostListener } from '@angular/core';
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


@Directive({
  selector: '[cc-editable-button]'
})
export class EditableButtonDirective {
  @Input('cc-editable-button')
  key: string;

  visible: boolean;

  constructor(
      private el: ElementRef,
      @Inject(forwardRef(() => EditableService))
      private service: EditableService,
      private renderer: Renderer) {
  }

  @HostListener('click')
  click() {
    this.service.startEdit(this.key);
  }

  @HostListener('keydown.Enter')
  enter() {
    this.service.startEdit(this.key);
  }

  ngOnInit() {
    this.applyVisibility();
    this.service.currentlyEditing
      .subscribe(key => {
        this.visible = key != this.key;
        this.applyVisibility();
      });
  }

  applyVisibility() {
    this.renderer.setElementAttribute(this.el.nativeElement, 'tabindex', this.visible? '1' : '9999');
  }
}

@Directive({
  selector: '[cc-ok-button]'
})
export class OkButtonDirective {
  @Input('cc-ok-button')
  key: string;

  visible: boolean;

  constructor(
      private el: ElementRef,
      @Inject(forwardRef(() => EditableService))
      private service: EditableService,
      private renderer: Renderer) {
  }

  ngOnInit() {
    this.applyVisibility();
    this.service.currentlyEditing
      .subscribe(key => {
        this.visible = key == this.key;
        this.applyVisibility();
      });
  }

  applyVisibility() {
    this.renderer.setElementAttribute(this.el.nativeElement, 'tabindex', this.visible? '1' : '9999');
  }

  @HostListener('click')
  click() {
    this.service.endEdit(this.key);
  }

  @HostListener('keydown.Enter')
  enter() {
    this.service.endEdit(this.key);
  }
}

@Directive({
  selector: '[cc-cancel-button]'
})
export class CancelButtonDirective {
  @Input('cc-cancel-button')
  key: string;

  visible: boolean;

  constructor(
      private el: ElementRef,
      @Inject(forwardRef(() => EditableService))
      private service: EditableService,
      private renderer: Renderer) {
  }

  ngOnInit() {
    this.applyVisibility();
    this.service.currentlyEditing
      .subscribe(key => {
        this.visible = key == this.key;
        this.applyVisibility();
      });
  }

  applyVisibility() {
    this.renderer.setElementAttribute(this.el.nativeElement, 'tabindex', this.visible? '1' : '9999');
  }

  @HostListener('click')
  click() {
    this.service.endEdit(this.key);
  }

  @HostListener('keydown.Enter')
  enter() {
    this.service.endEdit(this.key);
  }
}

@Directive({
  selector: '[cc-editable-display]'
})
export class EditableDisplayDirective implements OnInit {
  @Input('cc-editable-display')
  key: string;

  visible: boolean;

  constructor(
      private el: ElementRef,
      @Inject(forwardRef(() => EditableService))
      private service: EditableService,
      private renderer: Renderer) {
    this.visible = true;
  }

  ngOnInit() {
    this.applyVisibility();
    this.service.currentlyEditing
      .subscribe(key => {
        this.visible = key != this.key;
        this.applyVisibility();
      });
  }

  applyVisibility() {
    this.renderer.setElementClass(this.el.nativeElement, 'off-screen', !this.visible);
  }
}

@Directive({
  selector: '[cc-editable-edit]'
})
export class EditableEditDirective implements OnInit {
  @Input('cc-editable-edit')
  key: string;

  visible: boolean;

  constructor(
      private el: ElementRef,
      @Inject(forwardRef(() => EditableService))
      private service: EditableService,
      private renderer: Renderer) {
    this.visible = false;
  }

  ngOnInit() {
    this.applyVisibility();
    this.service.currentlyEditing
      .subscribe(key => {
        this.visible = key == this.key;
        this.applyVisibility();
      });
  }

  applyVisibility() {
    this.renderer.setElementClass(this.el.nativeElement, 'off-screen', !this.visible);
  }
}

@Directive({
  selector: '[cc-editable-background]'
})
export class EditableBackgroundDirective implements OnInit {
  @Input('cc-editable-background')
  key: string;

  editing: boolean;

  constructor(
      private el: ElementRef,
      @Inject(forwardRef(() => EditableService))
      private service: EditableService,
      private renderer: Renderer) {
    this.editing = false;
  }

  ngOnInit() {
    this.applyBackground();
    this.service.currentlyEditing
      .subscribe(key => {
        console.log('editing: ' + key)  
        this.editing = key == this.key;
        this.applyBackground();
      });
  }

  applyBackground() {
    this.renderer.setElementClass(this.el.nativeElement, 'editable-background', this.editing);
  }
}


@Component({
  selector: '[cc-order-section]',
  templateUrl: 'app/customers/orders/order-section.component.html',
  directives: [ActiveElementDirective, ActivateOnFocusDirective, DeactivateOnBlurDirective, DistributeWidthDirective, OrderItemQuantityComponent, DistributeWidthSumDirective, EditableValueComponent, NumericDirective, ProductQuantityComponent, EditableDisplayDirective, EditableEditDirective, EditableButtonDirective, OkButtonDirective, CancelButtonDirective, EditableBackgroundDirective],
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
  currentlyEditing = new BehaviorSubject<string>(null);

  startEdit(key: string) {
    this.currentlyEditing.next(key);
  }

  endEdit(key: string) {
    this.currentlyEditing.next(null);
  }
}