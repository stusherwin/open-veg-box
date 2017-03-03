import { Input, Directive, OnInit, OnDestroy, ElementRef, Inject, forwardRef, HostListener, OnChanges, ChangeDetectorRef, AfterViewChecked, AfterViewInit, Renderer, EventEmitter, Output, HostBinding } from '@angular/core';
import { Arrays } from '../shared/arrays'

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

  constructor(
    private el: ElementRef,

    @Inject(forwardRef(() => DistributeWidthService))
    private service: DistributeWidthService,
    
    private changeDetector: ChangeDetectorRef) {
  }

  get element() {
    return this.el.nativeElement;
  }

  @Input('cc-distribute-width')
  key: string;

  ngOnInit() {
    console.log('OnInit');
    this.service.register(this);
  }

  ngOnDestroy() {
    this.service.deregister(this);
  }

  ngAfterViewChecked() {
    // TODO: move this out of AfterViewChecked?
    // Here because AfterViewChecked is the earliest event where correct element widths are available
    let newWidth = this.el.nativeElement.getBoundingClientRect().width;
    if(newWidth != this.width) {
      this.width = newWidth;
      this.service.widthChanged(this);
    }
  }

  newMinWidth(width: number){
    console.log('newMinWidth: ' + width);
    this.minWidth = width;
    this.changeDetector.detectChanges();
  }
}

export class DistributeWidthService {
  minWidths: { [key: string]: number; } = {};
  directives: { [key: string]: DistributeWidthDirective[]} = {};

  register(directive: DistributeWidthDirective) {
    if(!this.directives[directive.key]) {
      this.directives[directive.key] = [directive];
    } else {
      this.directives[directive.key].push(directive);
    }

    if(!this.minWidths[directive.key]) {
      this.minWidths[directive.key] = 0;
    }

    console.log('registering: ' + directive.key);
  }
  
  deregister(directive: DistributeWidthDirective) {
    Arrays.remove(this.directives[directive.key], directive);

    this.recalculateWidths(directive.key);
  }

  widthChanged(directive: DistributeWidthDirective) {
    console.log('widthChanged (' + directive.key + '): ' + directive.width);
    this.recalculateWidths(directive.key);
  }

  private recalculateWidths(key: string) {
    let minWidth = this.minWidths[key];
    let newMinWidth = Math.max(...this.directives[key].map(c => c.width));

    if(newMinWidth != minWidth) {
      this.minWidths[key] = newMinWidth;
      this.directives[key].forEach(d => d.newMinWidth(newMinWidth));
    }
  } 
}