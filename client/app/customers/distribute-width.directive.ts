import { Input, Directive, OnInit, OnDestroy, ElementRef, Inject, forwardRef, HostListener, OnChanges, ChangeDetectorRef, AfterViewChecked, AfterViewInit, Renderer, EventEmitter, Output, HostBinding } from '@angular/core';
import { Arrays } from '../shared/arrays'
import {Observable} from 'rxjs/Observable';
import {ReplaySubject} from 'rxjs/ReplaySubject';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Subscription} from 'rxjs/Subscription';
import 'rxjs/add/operator/throttleTime';
import 'rxjs/add/operator/bufferTime';
import 'rxjs/add/operator/filter';

const MIN_WIDTH_THROTTLE_MS = 300;
let id = 0;

@Directive({
  selector: '[cc-distribute-width]',
  // host: {
  //   '(window:resize)': 'windowResized($event)',
  // }
})
export class DistributeWidthDirective implements OnInit, OnDestroy {
  width: number = 0;

  @HostBinding('style.min-width.px')
  minWidth: number = 0;

  id: number;

  constructor(
    private el: ElementRef,

    @Inject(forwardRef(() => DistributeWidthService))
    private service: DistributeWidthService,

    private changeDetector: ChangeDetectorRef) {
      this.id = id++;
      // console.log(this.id + ' constructor')
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
    // console.log(this.key + this.id + ' OnInit');

    this.service.register(this);
    if(this.subscription) {
      this.subscription.unsubscribe();
    }
    this.subscription = this.service.minWidthChanged
      .bufferTime(MIN_WIDTH_THROTTLE_MS)
      .filter(a => !!a.length)
      .map(a => a[a.length - 1])
      .filter(e => e != null)
      .subscribe(e => {
        if(this.minWidth != e[this.key]) {
          console.log(this.key + this.id + ' minWidthChanged event: ' + e[this.key]);
          this.minWidth = e[this.key];
          if(this.shouldDetectChanges) {
            this.changeDetector.detectChanges();
          }
        }
      })
  }

  ngOnDestroy() {
    this.service.deregister(this);
    this.subscription.unsubscribe();
  }

  ngAfterViewChecked() {
    this.shouldDetectChanges = true;
    // TODO: move this out of AfterViewChecked?
    // Here because AfterViewChecked is the earliest event where correct element widths are available
    let newWidth = this.el.nativeElement.getBoundingClientRect().width;
    if(newWidth != this.width) {
      this.width = newWidth;
      if(this.width != this.minWidth) {
      // console.log(this.key + this.id + ' width changed: ' + newWidth );
        this.service.widthChanged(this);
      }
    }
  }
}

let sumId = 0;

@Directive({
  selector: '[cc-distribute-width-sum]',
  // host: {
  //   '(window:resize)': 'windowResized($event)',
  // }
})
export class DistributeWidthSumDirective implements OnInit, OnDestroy {
  width: number = 0;

  @HostBinding('style.min-width.px')
  minWidth: number = 0;

  id: number;

  constructor(
    private el: ElementRef,

    @Inject(forwardRef(() => DistributeWidthService))
    private service: DistributeWidthService,

    private changeDetector: ChangeDetectorRef) {
      this.id = sumId++;
      //console.log('sum' + this.id + ' constructor')
  }

  get element() {
    return this.el.nativeElement;
  }

  @Input('cc-distribute-width-sum')
  keysString: string;

  keys: string[];

  subscription: Subscription;
  shouldDetectChanges: boolean;

  ngOnInit() {
    this.shouldDetectChanges = false;

    this.keys = this.keysString.split(',');
    // console.log('sum' + this.id + ' OnInit');

    if(this.subscription) {
      this.subscription.unsubscribe();
    }
    this.subscription = this.service.minWidthChanged
      .bufferTime(MIN_WIDTH_THROTTLE_MS)
      .filter(a => !!a.length)
      .map(a => a[a.length - 1])
      .filter(e => e != null)
      .subscribe(e => {
        let newMinWidth = 0;
        for(let k of this.keys) {
          newMinWidth += e[k];
        }
        if(this.minWidth != newMinWidth) {
          console.log('sum' + this.id + ' minWidthChanged event: ' + newMinWidth);
          this.minWidth = newMinWidth;
          if(this.shouldDetectChanges) {
            this.changeDetector.detectChanges();
          }
        }
      })
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  ngAfterViewChecked() {
    this.shouldDetectChanges = true;
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

  widthChanged(directive: DistributeWidthDirective) {
    this.recalculateWidths(directive.key);
  }

  private recalculateWidths(key: string) {
    let minWidth = this.minWidths[key];
    let newMinWidth = Math.max(...this.directives[key].map(c => c.width));

    if(newMinWidth != minWidth) {
      // console.log('old minWidth: ' + minWidth);
      // console.log('new minWidth: ' + newMinWidth);
      this.minWidths[key] = newMinWidth;
      // console.log('emit event: ' + key + '(' + newMinWidth + ')')
      this._minWidthChanged.next(this.minWidths);
    }
  }
}