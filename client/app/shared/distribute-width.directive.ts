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
  selector: '[cc-distribute-width-master]',
})
export class DistributeWidthMasterDirective implements OnInit, OnDestroy, AfterViewChecked {
  width: number = 0;

  id: number;
  innerHTML: string = '';

  constructor(
    private el: ElementRef,
    @Inject(forwardRef(() => DistributeWidthService))
    private service: DistributeWidthService,
    private renderer: Renderer) {
      this.id = id++;
  }

  get element() {
    return this.el.nativeElement;
  }

  @Input('cc-distribute-width-master')
  key: string;

  ngOnInit() {
    this.service.register(this);

    let minWidth = this.service.getMinWidth(this.key);
    let els = document.querySelectorAll('[cc-distribute-width='+this.key+']');
    for(let i = 0; i < els.length; i++) {
      let el = els[i];
      if(el instanceof HTMLElement) {
        let htmlEl: HTMLElement = el;
        htmlEl.style.minWidth = minWidth + 'px';
      }
    } 
  }

  ngOnDestroy() {
    this.service.deregister(this);
  }

  ngAfterViewChecked() {
    // TODO: move this out of AfterViewChecked?
    // Here because AfterViewChecked is the earliest event where correct element widths are available
    let oldWidth = this.width;
    this.width = this.el.nativeElement.getBoundingClientRect().width;
    if(this.width != oldWidth) {
      let minWidthChanged = this.service.widthChanged(this);
      if(minWidthChanged) {        
        let minWidth = this.service.getMinWidth(this.key);
        let els = document.querySelectorAll('[cc-distribute-width='+this.key+']');
        for(let i = 0; i < els.length; i++) {
          let el = els[i];
          if(el instanceof HTMLElement) {
            let htmlEl: HTMLElement = el;
            htmlEl.style.minWidth = minWidth + 'px';
          }
        }
      }
    }
  }
}

export class DistributeWidthService {
  private minWidths: { [key: string]: number; } = {};
  private directives: { [key: string]: DistributeWidthMasterDirective[]} = {};

  register(directive: DistributeWidthMasterDirective) {
    if(!this.directives[directive.key]) {
      this.directives[directive.key] = [directive];
    } else if(this.directives[directive.key].indexOf(directive) == -1) {
      this.directives[directive.key].push(directive);
    }

    if(!this.minWidths[directive.key]) {
      this.minWidths[directive.key] = 0;
    }
  }

  deregister(directive: DistributeWidthMasterDirective) {
    Arrays.remove(this.directives[directive.key], directive);

    this.recalculateWidths(directive.key);
  }

  widthChanged(directive: DistributeWidthMasterDirective): boolean {
    let oldMinWidth = this.minWidths[directive.key];
    let newMinWidth = this.recalculateWidths(directive.key);
    return oldMinWidth != newMinWidth;
  }

  getMinWidth(key: string): number {
    return this.minWidths[key];
  }

  private recalculateWidths(key: string): number {
    let minWidth = this.minWidths[key];
    let newMinWidth = Math.max(...this.directives[key].map(c => c.width));

    if(newMinWidth != minWidth) {
      this.minWidths[key] = newMinWidth;
    }

    return newMinWidth;
  }
}