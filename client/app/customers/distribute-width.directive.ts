import { Input, Directive, OnInit, OnDestroy, ElementRef, Inject, forwardRef, HostListener, OnChanges, ChangeDetectorRef, AfterViewChecked, AfterViewInit, Renderer, EventEmitter, Output, HostBinding } from '@angular/core';
import { Arrays } from '../shared/arrays'
import {Observable} from 'rxjs/Observable';
import {ReplaySubject} from 'rxjs/ReplaySubject';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Subscription} from 'rxjs/Subscription';
import 'rxjs/add/operator/throttleTime';
import 'rxjs/add/operator/bufferTime';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/debounceTime';

const MIN_WIDTH_DEBOUNCE_MS = 1;
let id = 0;

@Directive({
  selector: '[cc-distribute-width]',
})
export class DistributeWidthDirective implements OnInit, OnDestroy, AfterViewInit, AfterViewChecked {
  width: number = 0;

  @HostBinding('style.min-width.px')
  minWidth: number = 0;
  id: number;
  innerHTML: string = '';

  constructor(
    private el: ElementRef,

    @Inject(forwardRef(() => DistributeWidthService))
    private service: DistributeWidthService,

    private changeDetector: ChangeDetectorRef,
    private renderer: Renderer) {
      this.id = id++;
  }

  get element() {
    return this.el.nativeElement;
  }

  @Input('cc-distribute-width')
  key: string;

  subscription: Subscription;
  shouldDetectChanges: boolean;

  ngOnInit() {
    this.shouldDetectChanges = false;

    this.service.register(this);
    if(this.subscription) {
      this.subscription.unsubscribe();
    }
    this.minWidth = this.service.getMinWidths()[this.key];
    this.subscription = this.service.minWidthChanged
      .filter(e => !!e)
      .debounceTime(MIN_WIDTH_DEBOUNCE_MS)
      .subscribe(e => {
        if(this.minWidth != e[this.key]) {
          this.minWidth = e[this.key];
          if(this.shouldDetectChanges) {
            try {
              this.changeDetector.detectChanges();
            } catch(e) {
              // Hack: ARRGH! Sometimes a directive enters destroyed state without calling ngOnDestroy
              // - looks like a race condition bug in Angular2? If that happens detectChanges()
              // blows up, but there's no way to detect that state as ngOnDestroy is the earliest
              // warning we have that the directive is being destroyed. So have to catch and throw "";
              // away the error.
            }
          }
        }
      })
  }

  ngOnDestroy() {
    this.shouldDetectChanges = false;
    this.subscription.unsubscribe();
    this.service.deregister(this);
  }

  ngAfterViewInit() {
  }

  resizing = true;
  ngAfterViewChecked() {
    this.shouldDetectChanges = true;

    if(!this.resizing) {
      let innerHTML = this.el.nativeElement.innerHTML;
      if(this.innerHTML != innerHTML) {
        this.innerHTML = innerHTML;
        this.minWidth = 0;
        this.resizing = true;
        this.changeDetector.detectChanges();
      }
      return;
    }
    
    if(this.resizing) {
      this.resizing = false;
      // TODO: move this out of AfterViewChecked?
      // Here because AfterViewChecked is the earliest event where correct element widths are available
      this.width = this.el.nativeElement.getBoundingClientRect().width;
      if(this.width != this.minWidth) {
        let newMinWidth = this.service.widthChanged(this);
        if(newMinWidth != this.minWidth) {
          this.minWidth = newMinWidth;
          this.changeDetector.detectChanges();
        }
      }
    }
  }
}

let sumId = 0;

@Directive({
  selector: '[cc-distribute-width-sum]',
})
export class DistributeWidthSumDirective implements OnInit, OnDestroy {
  @HostBinding('style.width.px')
  width: number;

  id: number;

  constructor(
    private el: ElementRef,

    @Inject(forwardRef(() => DistributeWidthService))
    private service: DistributeWidthService,

    private changeDetector: ChangeDetectorRef) {
      this.id = sumId++;
  }

  get element() {
    return this.el.nativeElement;
  }

  @Input('cc-distribute-width-sum')
  keysString: string;

  @Input('padding')
  padding: number;

  keys: string[];

  subscription: Subscription;
  shouldDetectChanges: boolean;

  ngOnInit() {
    this.shouldDetectChanges = false;

    this.keys = this.keysString.split(',');

    this.width = this.calculateWidth(this.service.getMinWidths());

    if(this.subscription) {
      this.subscription.unsubscribe();
    }

    this.subscription = this.service.minWidthChanged
      .filter(e => !!e)
      .debounceTime(MIN_WIDTH_DEBOUNCE_MS)
      .subscribe(e => {
        let newWidth = this.calculateWidth(e);
        if(this.width != newWidth) {
          this.width = newWidth;
          if(this.shouldDetectChanges) {
            try {
              this.changeDetector.detectChanges();
            } catch (e) {
              // Hack: ARRGH! Sometimes a directive enters destroyed state without calling ngOnDestroy
              // - looks like a race condition bug in Angular2? If that happens detectChanges()
              // blows up, but there's no way to detect that state as ngOnDestroy is the earliest
              // warning we have that the directive is being destroyed. So have to catch and throw "";
              // away the error.
            }
          }
        }
      })
  }

  ngOnDestroy() {
    this.shouldDetectChanges = false;
    if(this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  ngAfterViewChecked() {
    this.shouldDetectChanges = true;
  }

  calculateWidth(minWidths: { [key: string]: number; }): number {
    let newWidth = this.padding;
    for(let k of this.keys) {
      newWidth += minWidths[k];
    }
    return newWidth;
  }
}

export class DistributeWidthService {
  private _minWidthChanged: BehaviorSubject<{ [key: string]: number; }> = new BehaviorSubject(null);
  private minWidths: { [key: string]: number; } = {};
  private directives: { [key: string]: DistributeWidthDirective[]} = {};

  minWidthChanged: Observable<{ [key: string]: number; }> = this._minWidthChanged;

  register(directive: DistributeWidthDirective) {
    if(!this.directives[directive.key]) {
      this.directives[directive.key] = [directive];
    } else if(this.directives[directive.key].indexOf(directive) == -1) {
      this.directives[directive.key].push(directive);
    }

    if(!this.minWidths[directive.key]) {
      this.minWidths[directive.key] = 0;
    }
  }

  deregister(directive: DistributeWidthDirective) {
    Arrays.remove(this.directives[directive.key], directive);

    this.recalculateWidths(directive.key);
  }

  widthChanged(directive: DistributeWidthDirective): number {
    return this.recalculateWidths(directive.key);
  }

  getMinWidths(): { [key: string]: number; } {
    return this.minWidths;
  }

  private recalculateWidths(key: string): number {
    let minWidth = this.minWidths[key];
    let newMinWidth = Math.max(...this.directives[key].map(c => c.width));

    if(newMinWidth != minWidth) {
      this.minWidths[key] = newMinWidth;
      this._minWidthChanged.next(this.minWidths);
    }

    return newMinWidth;
  }
}